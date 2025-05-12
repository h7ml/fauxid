import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import IdentityGeneratorForm from "@/components/identity/identity-generator-form";
import { generateRandomIdentity } from "@/lib/identity-generator";
import IdentityCard from "@/components/identity/identity-card";
import { ArrowRight, CheckCircle, ScanFace, Sparkles, User, Users, QrCode } from "lucide-react";

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
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5 border-b border-primary/10 theme-transition">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6 theme-transition">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary-foreground mb-2">
                <Sparkles className="h-3.5 w-3.5 mr-2" />
                <span>全新界面体验</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                虚拟身份<span className="text-primary">生成器</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed">
                快速生成逼真的虚拟身份数据，用于开发、测试或其他合法用途。不收集任何个人信息。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/protected/identities">
                  <Button size="lg" className="font-medium theme-transition btn-primary">
                    开始使用
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="outline" size="lg" className="font-medium theme-transition">
                    注册账号
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative max-w-sm">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-xl blur opacity-30"></div>
                <div className="relative">
                  <IdentityCard identity={sampleIdentity} showActions={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-12 md:py-24 lg:py-32 theme-transition">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2 max-w-[800px]">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">主要特点</h2>
              <p className="text-muted-foreground md:text-xl/relaxed">
                我们的虚拟身份生成器提供多种功能，满足您的各种需求
              </p>
            </div>
          </div>
          <div className="grid max-w-5xl mx-auto gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-background p-6 rounded-xl border border-border/40 shadow-sm hover-card-effect">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <ScanFace className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">真实可信的数据</h3>
              <p className="text-muted-foreground">
                生成符合中国身份证规则的身份信息，包括姓名、性别、出生日期等
              </p>
            </div>
            <div className="bg-background p-6 rounded-xl border border-border/40 shadow-sm hover-card-effect">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">可自定义参数</h3>
              <p className="text-muted-foreground">
                可以指定性别、年龄范围、地区等参数，生成符合特定条件的身份
              </p>
            </div>
            <div className="bg-background p-6 rounded-xl border border-border/40 shadow-sm hover-card-effect">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">批量生成</h3>
              <p className="text-muted-foreground">
                支持一次性生成多个身份信息，提高工作效率
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 border-y border-primary/10 theme-transition">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center mb-8">
            <div className="space-y-2 max-w-[800px]">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">实用工具</h2>
              <p className="text-muted-foreground md:text-xl/relaxed">
                除了身份生成，我们还提供其他实用工具帮助您提高效率
              </p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            <Link href="/tools/csv-to-authenticator" className="group">
              <div className="bg-background p-6 rounded-xl border border-border/40 shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <QrCode className="h-6 w-6 text-primary" />
                  </div>
                  <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform duration-200">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="text-xl font-bold mb-2">CSV转Authenticator</h3>
                <p className="text-muted-foreground flex-grow">
                  将CSV格式的双因素认证密钥转换为Authenticator应用可扫描的QR码
                </p>
              </div>
            </Link>
            {/* 这里可以添加更多工具卡片 */}
          </div>
        </div>
      </section>

      {/* Try It Now */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5 border-y border-primary/10 theme-transition">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-2 max-w-[800px]">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">立即尝试</h2>
              <p className="text-muted-foreground md:text-xl/relaxed">
                注册账号后可以保存生成的身份信息，方便后续使用
              </p>
            </div>
            <div className="w-full max-w-lg mx-auto">
              <div className="bg-background rounded-xl border border-border/40 shadow-sm p-6 apple-blur-bg mt-8">
                <IdentityGeneratorForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 border-t">
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} <Image src="/images/logo.jpg" alt="FauxID Logo" width={60} height={20} className="inline-block h-5 w-auto object-contain align-middle mx-1" /> 仅用于合法用途。
          </p>
        </div>
      </footer>
    </div>
  );
}
