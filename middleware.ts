import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { withAuth } from "next-auth/middleware";

// 注意：这里将两个中间件整合到一起
async function middleware(request: NextRequest) {
  // 首先运行 Supabase 会话更新
  const response = await updateSession(request);
  
  // 处理 Next-Auth 登录后重定向
  const nextAuthToken = request.cookies.get("next-auth.session-token")?.value;
  if (request.nextUrl.pathname === "/sign-in" && nextAuthToken) {
    return NextResponse.redirect(new URL("/protected", request.url));
  }

  // 处理受保护路由：如果没有通过 NextAuth 或 Supabase 验证，则重定向
  if (request.nextUrl.pathname.startsWith("/protected")) {
    // Supabase 验证通过了吗？
    const supabaseResponse = response as NextResponse;
    const supabaseUser = supabaseResponse.cookies.get("supabase-auth-token")?.value;
    
    // 如果两种验证都失败了，重定向到登录页
    if (!nextAuthToken && !supabaseUser) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }
  
  return response;
}

export default middleware;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
