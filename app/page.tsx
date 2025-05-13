import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import IdentityGeneratorForm from "@/components/identity/identity-generator-form";
import { generateRandomIdentity } from "@/lib/identity-generator";
import IdentityCard from "@/components/identity/identity-card";
import { ArrowRight, CheckCircle, ScanFace, Sparkles, User, Users, QrCode, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "FauxID - 免费虚拟身份生成器",
  description: "生成高质量的虚拟身份信息，用于测试或开发用途。",
};

export default function Home() {
  // 生成一个预览身份
  const sampleIdentity = generateRandomIdentity();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-28 border-b border-primary/10 relative overflow-hidden theme-transition bg-background">
        {/* 背景装饰 */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-80"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

        <div className="container px-4 md:px-6 mx-auto relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6 theme-transition">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 bg-primary/10 border-primary/20 text-primary">
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  <span>新版本 1.0</span>
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span>开源项目</span>
                </Badge>
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                虚拟身份<span className="text-primary">生成器</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                快速生成逼真的虚拟身份数据，用于开发、测试或其他合法用途。<span className="text-foreground font-medium">不收集任何个人信息。</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/protected/identities">
                  <Button size="lg" className="font-medium theme-transition btn-primary group relative overflow-hidden">
                    <span className="relative z-10">开始使用</span>
                    <ArrowRight className="ml-2 h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="outline" size="lg" className="font-medium theme-transition group">
                    注册账号
                    <div className="w-1 h-1 rounded-full bg-primary ml-2 group-hover:w-5 transition-all duration-300"></div>
                  </Button>
                </Link>
              </div>

              <div className="hidden md:flex items-center pt-4">
                <a href="#features" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <span>查看更多</span>
                  <ChevronDown className="h-4 w-4 animate-bounce" />
                </a>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative max-w-sm">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-secondary/40 rounded-xl blur opacity-50 animate-pulse-slow"></div>
                <div className="relative transition-transform hover:scale-[1.02] duration-500 hover:rotate-1">
                  <IdentityCard identity={sampleIdentity} showActions={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="w-full py-16 md:py-24 lg:py-28 theme-transition bg-accent/5">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <Badge variant="outline" className="px-3 py-1 mb-2">
              <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <span>特性与功能</span>
            </Badge>
            <div className="space-y-2 max-w-[800px]">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">为什么选择 FauxID</h2>
              <p className="text-muted-foreground md:text-xl/relaxed">
                我们的虚拟身份生成器提供多种功能，满足您的各种需求
              </p>
            </div>
          </div>

          <div className="grid max-w-5xl mx-auto gap-8 md:grid-cols-3">
            <div className="bg-background p-8 rounded-xl border border-border/40 shadow-sm hover-card-effect group">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ScanFace className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">真实可信的数据</h3>
              <p className="text-muted-foreground">
                生成符合中国身份证规则的身份信息，包括姓名、性别、出生日期等
              </p>
            </div>

            <div className="bg-background p-8 rounded-xl border border-border/40 shadow-sm hover-card-effect group">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <User className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">可自定义参数</h3>
              <p className="text-muted-foreground">
                可以指定性别、年龄范围、地区等参数，生成符合特定条件的身份
              </p>
            </div>

            <div className="bg-background p-8 rounded-xl border border-border/40 shadow-sm hover-card-effect group">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">批量生成</h3>
              <p className="text-muted-foreground">
                支持一次性生成多个身份信息，提高工作效率
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="w-full py-16 md:py-24 border-y border-primary/10 theme-transition bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <Badge variant="outline" className="px-3 py-1 mb-2">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <span>工具集</span>
            </Badge>
            <div className="space-y-2 max-w-[800px]">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">实用工具</h2>
              <p className="text-muted-foreground md:text-xl/relaxed">
                除了身份生成，我们还提供其他实用工具帮助您提高效率
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            <Link href="/tools/csv-to-authenticator" className="group">
              <div className="bg-background p-6 rounded-xl border border-border/40 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <QrCode className="h-6 w-6 text-primary" />
                  </div>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-primary/60 group-hover:text-primary transition-colors group-hover:bg-primary/10">
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">CSV转Authenticator</h3>
                <p className="text-muted-foreground flex-grow">
                  将CSV格式的双因素认证密钥转换为Authenticator应用可扫描的QR码
                </p>
              </div>
            </Link>

            {/* 这里可以添加更多工具卡片 */}
            <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 shadow-sm h-full flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">更多工具即将上线</h3>
              <p className="text-muted-foreground">
                我们正在开发更多实用工具，敬请期待
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Try It Now */}
      <section className="w-full py-16 md:py-24 bg-primary/5 border-y border-primary/10 theme-transition">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-8 text-center">
            <Badge variant="outline" className="px-3 py-1 mb-2">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <span>立即体验</span>
            </Badge>
            <div className="space-y-2 max-w-[800px]">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">快速生成身份</h2>
              <p className="text-muted-foreground md:text-xl/relaxed">
                注册账号后可以保存生成的身份信息，方便后续使用
              </p>
            </div>

            <div className="w-full max-w-2xl mx-auto">
              <div className="bg-background rounded-xl border border-border/40 shadow-md p-8 apple-blur-bg mt-8">
                <IdentityGeneratorForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
