"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// 头像上传处理函数
export async function uploadAvatar(formData: FormData) {
  try {
    const supabase = await createClient();
    
    // 获取用户信息
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "用户未登录" };
    }
    
    // 获取文件
    const file = formData.get("avatar") as File;
    if (!file || !file.size) {
      return { success: false, error: "未选择文件或文件为空" };
    }
    
    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "请上传图片文件" };
    }
    
    // 限制文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "文件大小不能超过5MB" };
    }
    
    // 生成唯一文件名
    const fileExt = file.name.split('.').pop();
    const fileName = `avatar-${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    // 上传文件到Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });
    
    if (uploadError) {
      console.error("上传错误:", uploadError);
      return { success: false, error: uploadError.message };
    }
    
    // 获取文件的公共URL
    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);
    
    // 更新用户元数据，添加头像URL
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        avatar_url: publicUrl
      }
    });
    
    if (updateError) {
      console.error("更新用户信息错误:", updateError);
      return { success: false, error: updateError.message };
    }
    
    // 刷新页面缓存
    revalidatePath('/protected/profile');
    
    return { 
      success: true, 
      data: { 
        avatarUrl: publicUrl 
      } 
    };
    
  } catch (error) {
    console.error("头像上传处理错误:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "未知错误" 
    };
  }
} 
