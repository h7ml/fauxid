"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// 获取当前会话
export async function getSession() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// 获取当前用户
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// 保护路由的辅助函数
export async function protectRoute(redirectTo: string = "/sign-in") {
  const user = await getCurrentUser();
  if (!user) {
    redirect(redirectTo);
  }
  return user;
} 
