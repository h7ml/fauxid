"use server";

import { createClient } from "@/utils/supabase/server";
import { GenerateIdentityOptions, IdentityType } from "@/lib/types";
import { generateMultipleIdentities, generateRandomIdentity } from "@/lib/identity-generator";
import { revalidatePath } from "next/cache";

// 生成一个虚假身份
export async function generateIdentity(formData: FormData) {
  const options: GenerateIdentityOptions = {};
  
  // 获取表单参数
  const gender = formData.get("gender") as string;
  const ageMin = parseInt(formData.get("age_min") as string || "18");
  const ageMax = parseInt(formData.get("age_max") as string || "70");
  const region = formData.get("region") as string;
  const country = formData.get("country") as string || "CN";
  
  if (gender && gender !== "random" && (gender === "男" || gender === "女")) {
    options.gender = gender as any;
  }
  
  if (!isNaN(ageMin)) {
    options.age_min = ageMin;
  }
  
  if (!isNaN(ageMax)) {
    options.age_max = ageMax;
  }
  
  if (region && region !== "random") {
    options.region = region;
  }
  
  if (country) {
    options.country = country as any;
  }
  
  // 生成身份信息
  const identity = generateRandomIdentity(options);
  
  try {
    // 获取当前用户
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // 将用户ID添加到身份信息中
      identity.user_id = user.id;
      
      // 保存到数据库
      const { error } = await supabase
        .from("identities")
        .insert(identity);
      
      if (error) {
        console.error("保存身份信息失败:", error);
        return { success: false, error: error.message, data: identity };
      }
    }
    
    revalidatePath("/");
    return { success: true, data: identity };
  } catch (error) {
    console.error("生成身份时出错:", error);
    return { success: false, error: "生成身份时发生错误", data: identity };
  }
}

// 生成多个虚假身份
export async function generateMultipleIdentitiesAction(formData: FormData) {
  const options: GenerateIdentityOptions = {};
  
  // 获取表单参数
  const count = parseInt(formData.get("count") as string || "5");
  const gender = formData.get("gender") as string;
  const ageMin = parseInt(formData.get("age_min") as string || "18");
  const ageMax = parseInt(formData.get("age_max") as string || "70");
  const region = formData.get("region") as string;
  const country = formData.get("country") as string || "CN";
  
  if (gender && gender !== "random" && (gender === "男" || gender === "女")) {
    options.gender = gender as any;
  }
  
  if (!isNaN(ageMin)) {
    options.age_min = ageMin;
  }
  
  if (!isNaN(ageMax)) {
    options.age_max = ageMax;
  }
  
  if (region && region !== "random") {
    options.region = region;
  }
  
  if (country) {
    options.country = country as any;
  }
  
  // 生成身份信息
  const identities = generateMultipleIdentities(Math.min(count, 50), options);
  
  try {
    // 获取当前用户
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // 将用户ID添加到身份信息中
      const identitiesWithUser = identities.map(identity => ({
        ...identity,
        user_id: user.id
      }));
      
      // 保存到数据库
      const { error } = await supabase
        .from("identities")
        .insert(identitiesWithUser);
      
      if (error) {
        console.error("保存多个身份信息失败:", error);
        return { success: false, error: error.message, data: identities };
      }
    }
    
    revalidatePath("/");
    return { success: true, data: identities };
  } catch (error) {
    console.error("生成多个身份时出错:", error);
    return { success: false, error: "生成多个身份时发生错误", data: identities };
  }
}

// 获取用户保存的身份列表
export async function getSavedIdentities() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "用户未登录" };
    }
    
    const { data, error } = await supabase
      .from("identities")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("获取保存的身份列表失败:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("获取保存的身份列表时出错:", error);
    return { success: false, error: "获取身份列表时发生错误" };
  }
}

// 标记或取消标记身份为收藏
export async function toggleFavorite(formData: FormData) {
  const id = formData.get("id") as string;
  const favorite = formData.get("favorite") === "true";
  
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "用户未登录" };
    }
    
    // 更新收藏状态
    const { error } = await supabase
      .from("identities")
      .update({ favorite: !favorite })
      .eq("id", id)
      .eq("user_id", user.id);
    
    if (error) {
      console.error("更新收藏状态失败:", error);
      return { success: false, error: error.message };
    }
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("切换收藏状态时出错:", error);
    return { success: false, error: "更新收藏状态时发生错误" };
  }
}

// 删除身份
export async function deleteIdentity(formData: FormData) {
  const id = formData.get("id") as string;
  
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "用户未登录" };
    }
    
    // 删除身份记录
    const { error } = await supabase
      .from("identities")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    
    if (error) {
      console.error("删除身份失败:", error);
      return { success: false, error: error.message };
    }
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("删除身份时出错:", error);
    return { success: false, error: "删除身份时发生错误" };
  }
}

// 获取单个身份详情
export async function getIdentity(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "用户未登录" };
    }
    
    const { data, error } = await supabase
      .from("identities")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();
    
    if (error) {
      console.error("获取身份详情失败:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("获取身份详情时出错:", error);
    return { success: false, error: "获取身份详情时发生错误" };
  }
}

// 更新身份备注
export async function updateNotes(formData: FormData) {
  const id = formData.get("id") as string;
  const notes = formData.get("notes") as string;
  
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "用户未登录" };
    }
    
    // 更新备注
    const { error } = await supabase
      .from("identities")
      .update({ notes })
      .eq("id", id)
      .eq("user_id", user.id);
    
    if (error) {
      console.error("更新备注失败:", error);
      return { success: false, error: error.message };
    }
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("更新备注时出错:", error);
    return { success: false, error: "更新备注时发生错误" };
  }
}

// 更新身份标签
export async function updateTags(formData: FormData) {
  const id = formData.get("id") as string;
  const tagsString = formData.get("tags") as string;
  
  // 将标签字符串转换为数组（假设标签以逗号分隔）
  const tags = tagsString
    .split(",")
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
  
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "用户未登录" };
    }
    
    // 更新标签
    const { error } = await supabase
      .from("identities")
      .update({ tags })
      .eq("id", id)
      .eq("user_id", user.id);
    
    if (error) {
      console.error("更新标签失败:", error);
      return { success: false, error: error.message };
    }
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("更新标签时出错:", error);
    return { success: false, error: "更新标签时发生错误" };
  }
}

// 添加标签
export async function addTag(formData: FormData) {
  const id = formData.get("id") as string;
  const tag = (formData.get("tag") as string).trim();
  
  if (!tag) {
    return { success: false, error: "标签不能为空" };
  }
  
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "用户未登录" };
    }
    
    // 先获取当前身份的标签
    const { data, error: fetchError } = await supabase
      .from("identities")
      .select("tags")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();
    
    if (fetchError) {
      console.error("获取身份标签失败:", fetchError);
      return { success: false, error: fetchError.message };
    }
    
    // 添加新标签（确保不重复）
    const currentTags = data.tags || [];
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag];
      
      // 更新标签
      const { error: updateError } = await supabase
        .from("identities")
        .update({ tags: newTags })
        .eq("id", id)
        .eq("user_id", user.id);
      
      if (updateError) {
        console.error("添加标签失败:", updateError);
        return { success: false, error: updateError.message };
      }
    }
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("添加标签时出错:", error);
    return { success: false, error: "添加标签时发生错误" };
  }
}

// 删除标签
export async function removeTag(formData: FormData) {
  const id = formData.get("id") as string;
  const tag = formData.get("tag") as string;
  
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "用户未登录" };
    }
    
    // 先获取当前身份的标签
    const { data, error: fetchError } = await supabase
      .from("identities")
      .select("tags")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();
    
    if (fetchError) {
      console.error("获取身份标签失败:", fetchError);
      return { success: false, error: fetchError.message };
    }
    
    // 移除标签
    const currentTags = data.tags || [];
    const newTags = currentTags.filter((t: string) => t !== tag);
    
    // 更新标签
    const { error: updateError } = await supabase
      .from("identities")
      .update({ tags: newTags })
      .eq("id", id)
      .eq("user_id", user.id);
    
    if (updateError) {
      console.error("删除标签失败:", updateError);
      return { success: false, error: updateError.message };
    }
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("删除标签时出错:", error);
    return { success: false, error: "删除标签时发生错误" };
  }
} 
