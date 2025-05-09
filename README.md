<p align="center">
  <img src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png" alt="FauxID - 免费虚拟身份生成器" width="500">
  <h1 align="center">FauxID - 免费虚拟身份生成器</h1>
</p>

<p align="center">
  基于 Next.js 和 Supabase 构建的虚拟身份生成与管理平台
</p>

<p align="center">
  <img src="https://github.com/h7ml/fauxid/actions/workflows/ci.yml/badge.svg" alt="CI Status">
  <img src="https://github.com/h7ml/fauxid/actions/workflows/cd.yml/badge.svg" alt="CD Status">
  <img src="https://github.com/h7ml/fauxid/actions/workflows/security.yml/badge.svg" alt="Security Status">
</p>

<p align="center">
  <a href="#特性">特性</a> ·
  <a href="#演示">演示</a> ·
  <a href="#本地开发">本地开发</a> ·
  <a href="#技术栈">技术栈</a> ·
  <a href="#部署">部署</a> ·
  <a href="#项目结构">项目结构</a>
</p>

## 特性

🔐 **虚拟身份生成**
- 支持生成符合中国身份证规则的身份信息
- 可自定义性别、年龄范围、地区等参数
- 支持批量生成和管理多个身份信息

🛡️ **用户认证与管理**
- 基于 Supabase Auth 的完整用户认证系统
- 支持邮箱注册、登录、密码重置
- 用户账户管理与个人资料设置

🎨 **现代化界面**
- 使用 Tailwind CSS 和 shadcn/ui 构建的美观界面
- 响应式设计，适配各种设备尺寸
- 支持深色/浅色主题切换

🔄 **数据持久化**
- 使用 Supabase 存储生成的身份信息
- 用户可以保存、编辑和删除自己的虚拟身份
- 支持设置收藏标记，方便快速访问

## 演示

访问 [https://fauxid.vercel.app](https://github.com/h7ml/fauxid) 查看在线演示。

## 本地开发

1. 克隆仓库

```bash
git clone https://github.com/h7ml/fauxid.git
cd fauxid
```

2. 安装依赖

```bash
# 使用 pnpm
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn
```

3. 配置环境变量

复制 `.env.example` 到 `.env.local` 并填写必要的环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase项目匿名密钥
```

4. 运行开发服务器

```bash
pnpm dev
```

应用将在 [http://localhost:3000](http://localhost:3000) 运行。

## 技术栈

- **前端框架**: [Next.js](https://nextjs.org/) - React 框架，支持服务端渲染和静态生成
- **后端服务**: [Supabase](https://supabase.com/) - 开源的 Firebase 替代品，提供数据库、认证和存储服务
- **样式解决方案**: [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- **UI 组件**: [shadcn/ui](https://ui.shadcn.com/) - 基于 Radix UI 的可复用组件集合
- **类型检查**: [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集，提供静态类型检查
- **表单处理**: [React Hook Form](https://react-hook-form.com/) - 高性能、灵活且可扩展的表单
- **验证**: [Zod](https://zod.dev/) - TypeScript 优先的模式验证库

## 部署

### Vercel 部署

1. Fork 此仓库到你的 GitHub 账户
2. 在 Vercel 控制台创建新项目并导入 GitHub 仓库
3. 配置必要的环境变量
4. 点击部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fh7ml%2Ffauxid&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&project-name=fauxid&repository-name=fauxid)

### Supabase 配置

1. 在 [Supabase](https://supabase.com/) 创建新项目
2. 启用邮箱认证
3. 创建必要的数据表和存储桶
4. 将项目 URL 和匿名密钥添加到环境变量

## 项目结构

```
fauxid/
├── app/                     # Next.js App Router 目录
│   ├── (auth-pages)/        # 认证相关页面（登录、注册等）
│   ├── actions/             # 服务器端 Actions
│   ├── protected/           # 需登录访问的页面
│   └── ...
├── components/              # 可复用组件
│   ├── identity/            # 身份相关组件
│   ├── ui/                  # UI 组件
│   └── ...
├── lib/                     # 工具函数和库
├── supabase/                # Supabase 相关配置
├── utils/                   # 实用工具
└── ...
```

## 贡献指南

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 许可证

该项目采用 MIT 许可证 - 详情见 [LICENSE](LICENSE) 文件

## 致谢

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
