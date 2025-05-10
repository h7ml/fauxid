"use server";

import { redirect } from "next/navigation";
import { signIn } from "next-auth/react";
import { cookies, headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

// GitHub登录 - 通过Supabase处理
export async function signInWithGithubAction() {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin;
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    console.error("GitHub登录错误:", error.message);
    return redirect(`/sign-in?error=${encodeURIComponent(error.message)}`);
  }

  return redirect(data.url);
}

// Linux.do 登录 - 通过NextAuth处理
export async function signInWithLinuxDoAction() {
  // NextAuth在服务器组件中不能直接调用signIn
  // 我们需要重定向到auth签名端点

  // 设置cookie以跟踪用户想要登录
  (await cookies()).set("auth_action", "linux_do_login", { 
    path: "/", 
    maxAge: 60 * 5, // 5分钟有效期
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" 
  });

  return redirect("/api/auth/signin/linux-do");
} 
