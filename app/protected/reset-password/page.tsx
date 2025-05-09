import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, Lock, ShieldCheck } from "lucide-react";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="w-full max-w-md mx-auto py-8 px-4">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">设置新密码</h1>
        <p className="text-muted-foreground">创建一个新的安全密码</p>
      </div>

      <Card className="shadow-lg animate-fadeIn border-muted/40">
        <CardHeader>
          <CardTitle className="text-xl">重置密码</CardTitle>
          <CardDescription>
            请在下方输入您的新密码
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" action={resetPasswordAction}>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                新密码
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="请输入新密码"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                确认密码
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="请确认密码"
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 ml-1">
                请确保两次输入的密码一致
              </p>
            </div>

            <div className="pt-2">
              <SubmitButton
                formAction={resetPasswordAction}
                className="w-full font-medium"
                pendingText="更新中..."
              >
                重置密码
              </SubmitButton>
            </div>

            <FormMessage message={searchParams} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
