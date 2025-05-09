"use server";

import { createClient } from "@/utils/supabase/server";
import { GenerateIdentityOptions, IdentityType, Country } from "@/lib/types";
import { generateMultipleIdentities, generateRandomIdentity } from "@/lib/identity-generator";
import { revalidatePath } from "next/cache";

// 生成一个虚假身份
export async function generateIdentity(formData: FormData) {
  try {
    const options: GenerateIdentityOptions = {};
    
    // 获取表单参数
    const gender = formData.get("gender") as string;
    const ageMin = parseInt(formData.get("age_min") as string || "18");
    const ageMax = parseInt(formData.get("age_max") as string || "70");
    const region = formData.get("region") as string;
    const country = formData.get("country") as string || "CN";
    const occupation_category = formData.get("occupation_category") as string;
    const education_level = formData.get("education_level") as string;
    
    // 新增选项
    const generate_avatar = formData.get("generate_avatar") === "true";
    const generate_credit_card = formData.get("generate_credit_card") === "true";
    const generate_social_media = formData.get("generate_social_media") === "true";
    
    console.log("生成身份参数:", {
      gender,
      ageMin,
      ageMax,
      region,
      country,
      occupation_category,
      education_level,
      generate_avatar,
      generate_credit_card,
      generate_social_media
    });
    
    if (gender && gender !== "random" && (gender === "男" || gender === "女")) {
      options.gender = gender;
    }
    
    options.age_min = ageMin;
    options.age_max = ageMax;
    
    if (region && region !== "random") {
      options.region = region;
    }
    
    options.country = country as Country;
    
    if (occupation_category) {
      options.occupation_category = occupation_category;
    }
    
    if (education_level) {
      options.education_level = education_level;
    }
    
    // 设置新增选项
    options.generate_avatar = generate_avatar;
    options.generate_credit_card = generate_credit_card;
    options.generate_social_media = generate_social_media;
    
    console.log("开始生成身份...");
    
    // 生成身份
    const identity = generateRandomIdentity(options);
    
    console.log("身份生成成功:", { 
      id: identity.id,
      name: identity.name, 
      gender: identity.gender,
      country: identity.country
    });
    
    // 验证用户登录状态
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return identity;
    }
    
    console.log("开始保存身份到数据库...");
    
    // 将身份保存到数据库
    const { data, error } = await supabase
      .from("identities")
      .insert({
        ...identity,
        user_id: user.id
      })
      .select()
      .single();
    
    if (error) {
      console.error("保存身份失败:", error);
      console.error("尝试保存的身份数据:", JSON.stringify(identity));
      return { error: `保存身份失败: ${error.message}` };
    }
    
    console.log("身份已成功保存到数据库");
    return data;
  } catch (e) {
    console.error("生成/保存身份时出错:", e);
    return { error: `生成身份时发生错误: ${e instanceof Error ? e.message : String(e)}` };
  }
}

// 生成多个虚假身份
export async function generateMultipleIdentitiesAction(formData: FormData) {
  try {
    const count = parseInt(formData.get("count") as string || "1");
    
    // 构建生成选项
    const options: GenerateIdentityOptions = {};
    
    const gender = formData.get("gender") as string;
    const ageMin = parseInt(formData.get("age_min") as string || "18");
    const ageMax = parseInt(formData.get("age_max") as string || "70");
    const region = formData.get("region") as string;
    const country = formData.get("country") as string || "CN";
    const occupation_category = formData.get("occupation_category") as string;
    const education_level = formData.get("education_level") as string;
    
    // 新增选项
    const generate_avatar = formData.get("generate_avatar") === "true";
    const generate_credit_card = formData.get("generate_credit_card") === "true";
    const generate_social_media = formData.get("generate_social_media") === "true";
    
    console.log("批量生成身份参数:", {
      count,
      gender,
      ageMin,
      ageMax,
      region,
      country,
      occupation_category,
      education_level,
      generate_avatar,
      generate_credit_card,
      generate_social_media
    });
    
    if (gender && gender !== "random" && (gender === "男" || gender === "女")) {
      options.gender = gender;
    }
    
    options.age_min = ageMin;
    options.age_max = ageMax;
    
    if (region && region !== "random") {
      options.region = region;
    }
    
    options.country = country as Country;
    
    if (occupation_category) {
      options.occupation_category = occupation_category;
    }
    
    if (education_level) {
      options.education_level = education_level;
    }
    
    // 设置新增选项
    options.generate_avatar = generate_avatar;
    options.generate_credit_card = generate_credit_card;
    options.generate_social_media = generate_social_media;
    
    console.log(`开始生成 ${count} 个身份...`);
    
    // 生成多个身份
    const identities: IdentityType[] = [];
    
    for (let i = 0; i < count; i++) {
      identities.push(generateRandomIdentity(options));
    }
    
    console.log(`已成功生成 ${identities.length} 个身份`);
    
    // 验证用户登录状态
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return identities;
    }
    
    console.log("开始批量保存身份到数据库...");
    
    // 将身份保存到数据库
    const { data, error } = await supabase
      .from("identities")
      .insert(
        identities.map(identity => ({
          ...identity,
          user_id: user.id
        }))
      )
      .select();
    
    if (error) {
      console.error("批量保存身份失败:", error);
      return { error: `批量保存身份失败: ${error.message}` };
    }
    
    console.log(`${data.length} 个身份已成功保存到数据库`);
    return data;
  } catch (e) {
    console.error("批量生成/保存身份时出错:", e);
    return { error: `批量生成身份时发生错误: ${e instanceof Error ? e.message : String(e)}` };
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
