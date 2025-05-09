import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "@/app/globals.css";
import type { Metadata } from "next";

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
      <body className="bg-background text-foreground relative" suppressHydrationWarning>
        {/* 背景装饰元素 */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none"></div>
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background opacity-70 pointer-events-none"></div>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-16 items-center">
              {/* 现代化的导航栏 */}
              <nav className="w-full sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-b-foreground/10 py-3">
                <div className="w-full max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
                  <div className="flex gap-5 items-center">
                    <Link href={"/"} className="text-lg font-bold text-primary hover:text-primary/80 transition-colors">
                      <span className="inline-block">FauxID</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-2">
                      <DeployButton />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                  </div>
                </div>
              </nav>

              <div className="flex flex-col gap-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
              </div>

              <footer className="w-full mt-auto border-t border-t-foreground/10 py-8">
                <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 text-sm gap-4">
                  <p className="text-muted-foreground">
                    © {new Date().getFullYear()} FauxID. 仅用于合法用途。
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
                    <ThemeSwitcher />
                  </div>
                </div>
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
