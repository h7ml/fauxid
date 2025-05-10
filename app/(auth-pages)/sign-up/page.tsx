import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitHubLoginButton } from "@/components/ui/github-login-button";
import { LinuxDoLoginButton } from "@/components/ui/linux-do-login-button";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { AtSign, Lock, UserPlus } from "lucide-react";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full max-w-md mx-auto py-8 px-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto py-8 px-4">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <UserPlus className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">创建账户</h1>
        <p className="text-muted-foreground">注册新账户以使用所有功能</p>
      </div>

      <Card className="shadow-lg animate-fadeIn border-muted/40">
        <CardHeader>
          <CardTitle className="text-xl">注册</CardTitle>
          <CardDescription>
            已有账号？{" "}
            <Link className="text-primary hover:text-primary/80 transition-colors font-medium" href="/sign-in">
              登录
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" action={signUpAction}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                邮箱
              </Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                密码
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="请输入密码"
                  className="pl-10"
                  minLength={6}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 ml-1">
                密码至少需要6个字符
              </p>
            </div>

            <div className="pt-2">
              <SubmitButton
                formAction={signUpAction}
                pendingText="正在注册..."
                className="w-full font-medium"
              >
                注册
              </SubmitButton>
            </div>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">或</span>
              </div>
            </div>

            <div className="space-y-3">
              <GitHubLoginButton />
              <LinuxDoLoginButton />
            </div>

            <FormMessage message={searchParams} />
          </form>
        </CardContent>
      </Card>

      <div className="mt-6">
        <SmtpMessage />
      </div>
    </div>
  );
}
