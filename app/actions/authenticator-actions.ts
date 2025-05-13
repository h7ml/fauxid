"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface AuthenticatorToken {
  id?: string;
  name: string;
  secret: string;
  issuer?: string;
  type?: string;
  algorithm?: string;
  digits?: number;
  period?: number;
  is_favorite?: boolean;
  notes?: string;
}

// 保存单个令牌
export async function saveAuthenticatorToken(token: AuthenticatorToken) {
  try {
    const supabase = await createClient();
    
    // 验证用户登录状态
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "需要登录才能保存令牌" };
    }
    
    // 保存令牌到数据库
    const { data, error } = await supabase
      .from("authenticator_tokens")
      .insert({
        ...token,
        user_id: user.id,
      })
      .select()
      .single();
    
    if (error) {
      console.error("保存令牌失败:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("保存令牌时发生错误:", error);
    return { success: false, error: "保存令牌时发生错误" };
  }
}

// 批量保存令牌
export async function saveMultipleAuthenticatorTokens(tokens: AuthenticatorToken[]) {
  try {
    const supabase = await createClient();
    
    // 验证用户登录状态
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "需要登录才能保存令牌" };
    }
    
    // 保存令牌到数据库
    const { data, error } = await supabase
      .from("authenticator_tokens")
      .insert(
        tokens.map(token => ({
          ...token,
          user_id: user.id,
        }))
      )
      .select();
    
    if (error) {
      console.error("批量保存令牌失败:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("批量保存令牌时发生错误:", error);
    return { success: false, error: "批量保存令牌时发生错误" };
  }
}

// 获取用户的所有令牌
export async function getUserAuthenticatorTokens() {
  try {
    const supabase = await createClient();
    
    // 验证用户登录状态
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "需要登录才能查看令牌" };
    }
    
    // 获取用户的所有令牌
    const { data, error } = await supabase
      .from("authenticator_tokens")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("获取令牌失败:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("获取令牌时发生错误:", error);
    return { success: false, error: "获取令牌时发生错误" };
  }
}

// 删除令牌
export async function deleteAuthenticatorToken(id: string) {
  try {
    const supabase = await createClient();
    
    // 验证用户登录状态
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "需要登录才能删除令牌" };
    }
    
    // 删除令牌
    const { error } = await supabase
      .from("authenticator_tokens")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    
    if (error) {
      console.error("删除令牌失败:", error);
      return { success: false, error: error.message };
    }
    
    revalidatePath("/tools/csv-to-authenticator");
    return { success: true };
  } catch (error) {
    console.error("删除令牌时发生错误:", error);
    return { success: false, error: "删除令牌时发生错误" };
  }
}

// 批量删除令牌
export async function deleteBulkAuthenticatorTokens(ids: string[]) {
  try {
    const supabase = await createClient();
    
    // 验证用户登录状态
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "需要登录才能删除令牌" };
    }
    
    if (ids.length === 0) {
      return { success: true, deletedCount: 0 };
    }
    
    // 批量删除令牌 - 使用 in 操作符一次性删除多个令牌
    const { error, count } = await supabase
      .from("authenticator_tokens")
      .delete({ count: 'exact' }) // 请求返回删除的记录数
      .in("id", ids)
      .eq("user_id", user.id);
    
    if (error) {
      console.error("批量删除令牌失败:", error);
      return { success: false, error: error.message };
    }
    
    revalidatePath("/tools/csv-to-authenticator");
    return { success: true, deletedCount: count };
  } catch (error) {
    console.error("批量删除令牌时发生错误:", error);
    return { success: false, error: "批量删除令牌时发生错误" };
  }
}

// 删除所有令牌
export async function deleteAllAuthenticatorTokens() {
  try {
    const supabase = await createClient();
    
    // 验证用户登录状态
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "需要登录才能删除令牌" };
    }
    
    // 删除当前用户的所有令牌
    const { error, count } = await supabase
      .from("authenticator_tokens")
      .delete({ count: 'exact' }) // 请求返回删除的记录数
      .eq("user_id", user.id);
    
    if (error) {
      console.error("删除所有令牌失败:", error);
      return { success: false, error: error.message };
    }
    
    revalidatePath("/tools/csv-to-authenticator");
    return { success: true, deletedCount: count };
  } catch (error) {
    console.error("删除所有令牌时发生错误:", error);
    return { success: false, error: "删除所有令牌时发生错误" };
  }
}

// 切换收藏状态
export async function toggleFavoriteToken(id: string) {
  try {
    const supabase = await createClient();
    
    // 验证用户登录状态
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "需要登录才能更新令牌" };
    }
    
    // 先获取当前令牌
    const { data: currentToken, error: fetchError } = await supabase
      .from("authenticator_tokens")
      .select("is_favorite")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();
    
    if (fetchError) {
      console.error("获取令牌失败:", fetchError);
      return { success: false, error: fetchError.message };
    }
    
    // 更新令牌收藏状态
    const { error } = await supabase
      .from("authenticator_tokens")
      .update({ is_favorite: !currentToken.is_favorite })
      .eq("id", id)
      .eq("user_id", user.id);
    
    if (error) {
      console.error("更新令牌收藏状态失败:", error);
      return { success: false, error: error.message };
    }
    
    revalidatePath("/tools/csv-to-authenticator");
    return { success: true };
  } catch (error) {
    console.error("更新令牌收藏状态时发生错误:", error);
    return { success: false, error: "更新令牌收藏状态时发生错误" };
  }
} 
