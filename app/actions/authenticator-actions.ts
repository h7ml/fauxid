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

// 使用复合键查找令牌(name+issuer+secret)
export async function findAuthenticatorTokenByCompositeKey(name: string, secret: string, issuer?: string) {
  try {
    const supabase = await createClient();
    
    // 验证用户登录状态
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "需要登录才能查找令牌" };
    }
    
    // 构建查询
    let query = supabase
      .from("authenticator_tokens")
      .select("*")
      .eq("user_id", user.id)
      .eq("name", name)
      .eq("secret", secret);
    
    // 如果有发行者，添加到条件中
    if (issuer) {
      query = query.eq("issuer", issuer);
    } else {
      // 如果没有提供发行者，查找发行者为null或空字符串的记录
      query = query.is("issuer", null);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("查找令牌失败:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("查找令牌时发生错误:", error);
    return { success: false, error: "查找令牌时发生错误" };
  }
}

// 更新认证令牌
export async function updateAuthenticatorToken(id: string, token: Partial<AuthenticatorToken>) {
  try {
    const supabase = await createClient();
    
    // 验证用户登录状态
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "需要登录才能更新令牌" };
    }
    
    // 更新令牌
    const { data, error } = await supabase
      .from("authenticator_tokens")
      .update({
        ...token,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();
    
    if (error) {
      console.error("更新令牌失败:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/tools/csv-to-authenticator");
    return { success: true, data };
  } catch (error) {
    console.error("更新令牌时发生错误:", error);
    return { success: false, error: "更新令牌时发生错误" };
  }
}

// 检查并导入多个令牌，处理重复情况
export async function checkAndImportAuthenticatorTokens(tokens: AuthenticatorToken[]) {
  try {
    const supabase = await createClient();
    
    // 验证用户登录状态
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "需要登录才能导入令牌" };
    }

    // 结果对象
    const result = {
      success: true,
      duplicates: [] as any[],
      inserted: [] as any[],
      errors: [] as string[]
    };
    
    // 检查每个令牌是否存在
    for (const token of tokens) {
      // 查找是否已存在相同的令牌
      const { success, data, error } = await findAuthenticatorTokenByCompositeKey(
        token.name,
        token.secret,
        token.issuer
      );
      
      if (!success) {
        result.errors.push(`检查令牌 ${token.name} 是否存在时发生错误: ${error}`);
        continue;
      }
      
      // 如果找到重复项，添加到重复列表
      if (data && data.length > 0) {
        result.duplicates.push({
          existing: data[0],
          new: token
        });
      } else {
        // 如果没有找到重复项，添加到插入列表
        try {
          const insertResult = await supabase
            .from("authenticator_tokens")
            .insert({
              ...token,
              user_id: user.id,
            })
            .select()
            .single();
            
          if (insertResult.error) {
            result.errors.push(`保存令牌 ${token.name} 时发生错误: ${insertResult.error.message}`);
          } else {
            result.inserted.push(insertResult.data);
          }
        } catch (insertError: any) {
          result.errors.push(`保存令牌 ${token.name} 时发生错误: ${insertError.message}`);
        }
      }
    }
    
    // 如果有错误但仍有成功插入的令牌，仍然认为部分成功
    if (result.errors.length > 0 && result.inserted.length === 0) {
      result.success = false;
    }
    
    revalidatePath("/tools/csv-to-authenticator");
    return result;
  } catch (error: any) {
    console.error("检查并导入令牌时发生错误:", error);
    return { 
      success: false, 
      error: "导入令牌时发生错误", 
      duplicates: [],
      inserted: [],
      errors: [error.message]
    };
  }
}

// 批量更新重复的令牌
export async function updateDuplicateAuthenticatorTokens(duplicates: { existingId: string, token: AuthenticatorToken }[]) {
  try {
    const supabase = await createClient();
    
    // 验证用户登录状态
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "需要登录才能更新令牌" };
    }
    
    const result = {
      success: true,
      updated: [] as any[],
      errors: [] as string[]
    };
    
    // 逐个更新令牌
    for (const { existingId, token } of duplicates) {
      try {
        const updateResult = await updateAuthenticatorToken(existingId, {
          name: token.name,
          secret: token.secret,
          issuer: token.issuer,
          type: token.type,
          algorithm: token.algorithm,
          digits: token.digits,
          period: token.period
        });
        
        if (!updateResult.success) {
          result.errors.push(`更新令牌 ${token.name} 时发生错误: ${updateResult.error}`);
        } else {
          result.updated.push(updateResult.data);
        }
      } catch (updateError: any) {
        result.errors.push(`更新令牌 ${token.name} 时发生错误: ${updateError.message}`);
      }
    }
    
    // 如果有错误但仍有成功更新的令牌，仍然认为部分成功
    if (result.errors.length > 0 && result.updated.length === 0) {
      result.success = false;
    }
    
    revalidatePath("/tools/csv-to-authenticator");
    return result;
  } catch (error: any) {
    console.error("批量更新重复令牌时发生错误:", error);
    return { 
      success: false, 
      error: "批量更新令牌时发生错误", 
      updated: [],
      errors: [error.message]
    };
  }
} 
