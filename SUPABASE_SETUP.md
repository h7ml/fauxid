# Supabase 配置指南

## 身份验证配置

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

## 项目环境变量

请确保在部署环境中设置以下环境变量:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

在 Cloudflare 部署时，另外设置:

```
CLOUDFLARE=true
```
