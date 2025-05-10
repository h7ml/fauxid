import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";

// 项目使用的Linux.do OAuth参数
const CLIENT_ID = process.env.LINUX_DO_CLIENT_ID || 'hi3geJYfTotoiR5S62u3rh4W5tSeC5UG';
const CLIENT_SECRET = process.env.LINUX_DO_CLIENT_SECRET || 'VMPBVoAfOB5ojkGXRDEtzvDhRLENHpaN';
const REDIRECT_URI = process.env.LINUX_DO_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/linux-do`;
const AUTHORIZATION_ENDPOINT = 'https://connect.linux.do/oauth2/authorize';
const TOKEN_ENDPOINT = 'https://connect.linux.do/oauth2/token';
const USER_ENDPOINT = 'https://connect.linux.do/api/user';

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "linux-do",
      name: "Linux.do",
      type: "oauth",
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      
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
      userinfo: USER_ENDPOINT,
      
      profile(profile) {
        return {
          id: profile.id || profile.sub || profile.uid || "",
          name: profile.name || profile.username || "",
          email: profile.email || "",
          image: profile.avatar || profile.picture || "",
        };
      },
    },
  ],
  
  callbacks: {
    async jwt({ token, account, user }) {
      // 初次登录时，将access_token添加到JWT中
      if (account && user) {
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 
