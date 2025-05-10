"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";

// 获取当前会话
export async function getSession() {
  return await getServerSession(authOptions);
}

// 获取当前用户
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

// 保护路由的辅助函数
export async function protectRoute(redirectTo: string = "/sign-in") {
  const session = await getSession();
  if (!session) {
    redirect(redirectTo);
  }
  return session;
} 
