# Supabase 与 NextAuth 配置指南

## Supabase 身份验证配置

### 1. URL 配置

在 Supabase 控制台中配置以下 URL:

1. 导航至 **Authentication → URL Configuration**
2. 添加以下 URL 到 **Site URL** 列表中:
   - `http://localhost:3000` (本地开发)
   - `https://fauxid.vercel.app` (Vercel 生产环境)
   - `https://fauxid.pages.dev` (Cloudflare 生产环境)
   - 其他您的应用可能使用的域名

### 2. 邮件模板配置

1. 导航至 **Authentication → Email Templates**
2. 配置以下三种邮件模板:

#### 确认邮件模板

```html
<h2>确认您的邮箱地址</h2>
<p>感谢您注册 Fauxid! 请点击以下链接确认您的邮箱:</p>
<p><a href="{{ .ConfirmationURL }}">确认邮箱</a></p>
<p>如果您没有注册 Fauxid 账户，请忽略此邮件。</p>
```

#### 邮箱登录模板 (Magic Link)

```html
<h2>登录 Fauxid</h2>
<p>点击以下链接登录您的账户:</p>
<p><a href="{{ .ConfirmationURL }}">登录 Fauxid</a></p>
<p>如果您没有请求此链接，请忽略此邮件。</p>
```

#### 重置密码模板

```html
<h2>重置您的密码</h2>
<p>您收到此邮件是因为有人请求重置您的密码。</p>
<p>点击以下链接重置密码:</p>
<p><a href="{{ .ConfirmationURL }}">重置密码</a></p>
<p>如果您没有请求重置密码，请忽略此邮件。</p>
```

### 3. 邮件发送配置

确保您的 Supabase 项目设置了有效的 SMTP 配置:

1. 导航至 **Project Settings → Authentication**
2. 在 **Email Auth** 部分中，确认已启用 **Enable Email Signup** 和 **Enable Email Confirmations**
3. 如果您使用自定义 SMTP 服务，请在 **SMTP Settings** 部分配置您的邮件发送服务信息

### 4. Supabase GitHub OAuth 配置

Supabase 支持通过 GitHub OAuth 进行登录，配置步骤如下：

1. 在 [GitHub 开发者设置](https://github.com/settings/developers) 创建新的 OAuth 应用
2. 配置授权回调 URL 为 `https://your-project.supabase.co/auth/v1/callback`
3. 在 Supabase 控制台的 **Authentication → Providers → GitHub** 中启用 GitHub 登录
4. 配置 GitHub Client ID 和 Client Secret
5. 启用 "Configure GitHub provider with Implicit Grant" 选项

## NextAuth 身份验证配置

### 1. NextAuth 设置

本项目使用 NextAuth.js 实现对 Linux.do 和 GitHub 的 OAuth 认证支持。配置如下：

1. 确保 `app/api/auth/[...nextauth]/auth.ts` 文件包含正确的 OAuth 提供商配置
2. 在 `.env.local` 文件中设置必要的 NextAuth 环境变量
3. 确保中间件正确配置，以同时支持 Supabase 和 NextAuth 认证

### 2. Linux.do OAuth 配置

要使用 Linux.do 登录，您需要：

1. 在 Linux.do 平台注册一个应用
2. 获取客户端 ID 和客户端密钥
3. 设置正确的重定向 URI：`https://您的域名/api/auth/callback/linux-do`
4. 将这些凭据添加到 `.env.local` 文件中

### 3. GitHub OAuth 配置 (NextAuth 方式)

要使用 NextAuth.js 的 GitHub 登录，您需要：

1. 在 [GitHub 开发者设置](https://github.com/settings/developers) 创建新的 OAuth 应用
2. 配置授权回调 URL 为 `https://您的域名/api/auth/callback/github`
3. 获取 Client ID 和 Client Secret
4. 将这些凭据添加到 `.env.local` 文件中

## 双重认证系统

本项目同时支持 Supabase 和 NextAuth 两种认证系统，具有以下特点：

1. **认证流程独立**：两个认证系统各自独立工作
2. **统一会话管理**：通过中间件实现两种认证的统一保护
3. **用户界面整合**：在登录页面上同时提供多种登录选项
4. **多种登录选择**：
   - 邮箱/密码登录 (Supabase)
   - GitHub 登录 (通过 Supabase 或 NextAuth)
   - Linux.do 登录 (通过 NextAuth)
5. **无缝用户体验**：用户无需了解底层认证差异

## 项目环境变量

请确保在部署环境中设置以下环境变量:

```bash
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 站点URL配置
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# NextAuth配置
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret  # 生成命令: openssl rand -base64 32

# GitHub OAuth配置 (NextAuth方式)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Linux.do OAuth配置
LINUX_DO_CLIENT_ID=your-linux-do-client-id
LINUX_DO_CLIENT_SECRET=your-linux-do-client-secret
LINUX_DO_REDIRECT_URI=https://your-domain.com/api/auth/callback/linux-do

# Cloudflare部署标记（如需要）
CLOUDFLARE=true
```
