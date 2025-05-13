import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import "@/app/globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/components/providers/auth-provider";
import { ShieldCheck, BookOpen, FileText, Home } from "lucide-react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "FauxID - 虚拟身份生成",
  description: "生成你的虚拟身份信息，用于保护个人隐私",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground relative theme-transition" suppressHydrationWarning>
        {/* 改进的背景装饰元素 - 使用更精细的径向渐变 */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none opacity-60"></div>
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background opacity-70 pointer-events-none"></div>
        <div className="fixed inset-0 -z-10 bg-cyber-grid bg-[length:40px_40px] pointer-events-none opacity-[0.03]"></div>

        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="min-h-screen flex flex-col items-center">
              <div className="flex-1 w-full flex flex-col gap-8 md:gap-16 items-center">
                {/* 优化导航栏 */}
                <nav className="w-full sticky top-0 z-50 apple-blur-bg py-3 border-b border-border/20">
                  <div className="w-full max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-5 items-center">
                      <Link href={"/"} className="text-lg font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-2">
                        <Image
                          src="/images/logo.jpg"
                          alt="FauxID Logo"
                          width={120}
                          height={40}
                          className="h-10 w-auto object-contain"
                          priority
                        />
                      </Link>
                      <div className="hidden md:flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <Home size={16} />
                          <span>首页</span>
                        </Link>
                        <Link href="/protected/identities" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <ShieldCheck size={16} />
                          <span>身份管理</span>
                        </Link>
                        <Link href="/books" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <BookOpen size={16} />
                          <span>图书</span>
                        </Link>
                        <Link href="/notes" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <FileText size={16} />
                          <span>笔记</span>
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                      <div className="hidden md:block">
                        <ThemeSwitcher />
                      </div>
                    </div>
                  </div>
                </nav>

                <div className="flex flex-col gap-10 md:gap-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
                  {children}
                </div>

                <footer className="w-full mt-auto border-t border-t-foreground/10 py-6">
                  <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 text-sm gap-4">
                    <p className="text-muted-foreground">
                      © {new Date().getFullYear()} <Image src="/images/logo.jpg" alt="FauxID Logo" width={60} height={20} className="inline-block h-5 w-auto object-contain align-middle mx-1" /> 仅用于合法用途。
                    </p>
                    <div className="flex items-center gap-6">
                      <p className="text-muted-foreground">
                        技术支持：{" "}
                        <a
                          href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                          target="_blank"
                          className="font-medium hover:text-primary transition-colors"
                          rel="noreferrer"
                        >
                          Supabase
                        </a>
                      </p>
                      <div className="md:hidden">
                        <ThemeSwitcher />
                      </div>
                    </div>
                  </div>
                </footer>
              </div>
            </main>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
