import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { AtSign, KeyRound } from "lucide-react";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="w-full max-w-md mx-auto py-8 px-4">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <KeyRound className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">找回密码</h1>
        <p className="text-muted-foreground">我们将向您的邮箱发送重置密码链接</p>
      </div>

      <Card className="shadow-lg animate-fadeIn border-muted/40">
        <CardHeader>
          <CardTitle className="text-xl">重置密码</CardTitle>
          <CardDescription>
            已有账号？{" "}
            <Link className="text-primary hover:text-primary/80 transition-colors font-medium" href="/sign-in">
              登录
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" action={forgotPasswordAction}>
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
              <p className="text-xs text-muted-foreground mt-1 ml-1">
                请输入您注册时使用的邮箱地址
              </p>
            </div>

            <div className="pt-2">
              <SubmitButton
                formAction={forgotPasswordAction}
                className="w-full font-medium"
                pendingText="发送中..."
              >
                发送重置链接
              </SubmitButton>
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
