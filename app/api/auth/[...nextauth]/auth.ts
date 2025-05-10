import type { NextAuthOptions } from "next-auth";
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";
import GitHubProvider from "next-auth/providers/github";

// 项目使用的Linux.do OAuth参数
const CLIENT_ID = process.env.LINUX_DO_CLIENT_ID;
const CLIENT_SECRET = process.env.LINUX_DO_CLIENT_SECRET;
const REDIRECT_URI = process.env.LINUX_DO_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/linux-do`;
const AUTHORIZATION_ENDPOINT = 'https://connect.linux.do/oauth2/authorize';
const TOKEN_ENDPOINT = 'https://connect.linux.do/oauth2/token';
const USER_ENDPOINT = 'https://connect.linux.do/api/user';

// 检查关键配置是否存在
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.warn("警告: Linux.do OAuth 配置不完整。请检查环境变量。");
}

// 自定义Linux.do提供商
const LinuxDoProvider: OAuthConfig<any> = {
  id: "linux-do",
  name: "Linux.do",
  type: "oauth",
  clientId: CLIENT_ID || "",
  clientSecret: CLIENT_SECRET || "",
  
  // 认证端点
  authorization: {
    url: AUTHORIZATION_ENDPOINT,
    params: { 
      redirect_uri: REDIRECT_URI,
      response_type: "code"
    }
  },
  
  // 令牌端点
  token: {
    url: TOKEN_ENDPOINT,
    params: { redirect_uri: REDIRECT_URI }
  },
  
  // 用户信息端点
  userinfo: {
    url: USER_ENDPOINT,
    async request({ tokens, provider }) {
      console.log("获取用户信息，令牌:", tokens);
      
      // 创建完整的请求
      const res = await fetch(USER_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });
      
      // 检查响应
      if (!res.ok) {
        console.error("获取用户信息失败:", await res.text());
        throw new Error("获取用户信息失败");
      }
      
      return await res.json();
    }
  },
  
  profile(profile) {
    console.log("收到的配置文件数据:", profile);
    return {
      id: profile.id || profile.sub || profile.uid || "",
      name: profile.name || profile.username || "",
      email: profile.email || "",
      image: profile.avatar || profile.picture || "",
    };
  },
};

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    LinuxDoProvider
  ],
  
  callbacks: {
    async jwt({ token, account, user }) {
      // 初次登录时，将access_token添加到JWT中
      if (account && user) {
        console.log("JWT 回调 - 用户:", user);
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at,
          userId: user.id
        };
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // 将JWT中的数据添加到session
      if (session.user) {
        session.user.id = token.userId as string;
        session.accessToken = token.accessToken as string;
      }
      
      return session;
    },
  },
  
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  
  debug: process.env.NODE_ENV === 'development',
  
  // 使用JWT会话策略
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-me",
}; 
