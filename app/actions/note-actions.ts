"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface NoteType {
  id?: string;
  site_url: string;
  title: string;
  username?: string;
  password?: string;
  notes?: string;
  token?: string;
  cookie?: string;
  tags?: string[];
  is_favorite?: boolean;
  created_at?: string;
  updated_at?: string;
  last_used_at?: string;
}

// 创建笔记
export async function createNote(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "用户未登录" };
    }
    
    const site_url = formData.get("site_url") as string;
    const title = formData.get("title") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const notes = formData.get("notes") as string;
    const token = formData.get("token") as string;
    const cookie = formData.get("cookie") as string;
    const tagsString = formData.get("tags") as string;
    
    // 将标签字符串转换为数组（以逗号分隔）
    const tags = tagsString
      ? tagsString
          .split(",")
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
      : [];
    
    const { data, error } = await supabase
      .from("notes")
      .insert({
        user_id: user.id,
        site_url,
        title,
        username,
        password,
        notes,
        token,
        cookie,
        tags
      })
      .select()
      .single();
    
    if (error) {
      console.error("创建笔记失败:", error);
      return { success: false, error: error.message };
    }
    
    revalidatePath("/notes");
    return { success: true, note: data };
  } catch (error) {
    console.error("创建笔记时出错:", error);
    return { success: false, error: "创建笔记时发生错误" };
  }
}

// 更新笔记
export async function updateNote(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "用户未登录" };
    }
    
    const id = formData.get("id") as string;
    const site_url = formData.get("site_url") as string;
    const title = formData.get("title") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const notes = formData.get("notes") as string;
    const token = formData.get("token") as string;
    const cookie = formData.get("cookie") as string;
    const tagsString = formData.get("tags") as string;
    
    // 将标签字符串转换为数组（以逗号分隔）
    const tags = tagsString
      ? tagsString
          .split(",")
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
      : [];
    
    const { data, error } = await supabase
      .from("notes")
      .update({
        site_url,
        title,
        username,
        password,
        notes,
        token,
        cookie,
        tags
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();
    
    if (error) {
      console.error("更新笔记失败:", error);
      return { success: false, error: error.message };
    }
    
    revalidatePath("/notes");
    return { success: true, note: data };
  } catch (error) {
    console.error("更新笔记时出错:", error);
    return { success: false, error: "更新笔记时发生错误" };
  }
}

// 删除笔记
export async function deleteNote(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "用户未登录" };
    }
    
    const id = formData.get("id") as string;
    
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    
    if (error) {
      console.error("删除笔记失败:", error);
      return { success: false, error: error.message };
    }
    
    revalidatePath("/notes");
    return { success: true };
  } catch (error) {
    console.error("删除笔记时出错:", error);
    return { success: false, error: "删除笔记时发生错误" };
  }
}

// 设置为收藏
export async function toggleFavorite(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "用户未登录" };
    }
    
    const id = formData.get("id") as string;
    const is_favorite = formData.get("is_favorite") === "true";
    
    const { error } = await supabase
      .from("notes")
      .update({ is_favorite: !is_favorite })
      .eq("id", id)
      .eq("user_id", user.id);
    
    if (error) {
      console.error("更新收藏状态失败:", error);
      return { success: false, error: error.message };
    }
    
    revalidatePath("/notes");
    return { success: true };
  } catch (error) {
    console.error("切换收藏状态时出错:", error);
    return { success: false, error: "更新收藏状态时发生错误" };
  }
}

// 更新最后使用时间
export async function updateLastUsed(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "用户未登录" };
    }
    
    const { error } = await supabase
      .from("notes")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id);
    
    if (error) {
      console.error("更新最后使用时间失败:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error("更新最后使用时间时出错:", error);
    return { success: false, error: "更新最后使用时间时发生错误" };
  }
}

// 导出笔记
export async function exportNotes() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "用户未登录" };
    }
    
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id);
    
    if (error) {
      console.error("导出笔记失败:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("导出笔记时出错:", error);
    return { success: false, error: "导出笔记时发生错误" };
  }
}

// 导入笔记
export async function importNotes(notes: NoteType[]) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "用户未登录" };
    }

    // 为所有要导入的笔记添加用户ID
    const notesWithUserId = notes.map(note => ({
      ...note,
      user_id: user.id,
      created_at: note.created_at || new Date().toISOString(),
      updated_at: note.updated_at || new Date().toISOString()
    }));
    
    const { error } = await supabase
      .from("notes")
      .insert(notesWithUserId);
    
    if (error) {
      console.error("导入笔记失败:", error);
      return { success: false, error: error.message };
    }
    
    revalidatePath("/notes");
    return { success: true };
  } catch (error) {
    console.error("导入笔记时出错:", error);
    return { success: false, error: "导入笔记时发生错误" };
  }
}

// 搜索笔记
export async function searchNotes(query: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "用户未登录" };
    }
    
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .or(`title.ilike.%${query}%,site_url.ilike.%${query}%,username.ilike.%${query}%,notes.ilike.%${query}%`);
    
    if (error) {
      console.error("搜索笔记失败:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("搜索笔记时出错:", error);
    return { success: false, error: "搜索笔记时发生错误" };
  }
} 
