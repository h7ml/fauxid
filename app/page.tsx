import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import IdentityGeneratorForm from "@/components/identity/identity-generator-form";
import { generateRandomIdentity } from "@/lib/identity-generator";
import IdentityCard from "@/components/identity/identity-card";

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
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                虚拟身份生成器
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                快速生成逼真的虚拟身份数据，用于开发、测试或其他合法用途。不收集任何个人信息。
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/protected/identities">
                  <Button size="lg">
                    开始使用
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="ml-2 h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="outline" size="lg">
                    注册账号
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto lg:mx-0">
              <IdentityCard identity={sampleIdentity} showActions={false} />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">主要特点</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                我们的虚拟身份生成器提供多种功能，满足您的各种需求
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <div className="grid gap-1">
              <h3 className="text-xl font-bold">真实可信的数据</h3>
              <p className="text-muted-foreground">
                生成符合中国身份证规则的身份信息，包括姓名、性别、出生日期等
              </p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-xl font-bold">可自定义参数</h3>
              <p className="text-muted-foreground">
                可以指定性别、年龄范围、地区等参数，生成符合特定条件的身份
              </p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-xl font-bold">批量生成</h3>
              <p className="text-muted-foreground">
                支持一次性生成多个身份信息，提高工作效率
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Try It Now */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">立即尝试</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                注册账号后可以保存生成的身份信息，方便后续使用
              </p>
            </div>
            <div className="w-full max-w-md mx-auto">
              <IdentityGeneratorForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 border-t">
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FauxID. 仅用于合法用途。
          </p>
        </div>
      </footer>
    </div>
  );
}
