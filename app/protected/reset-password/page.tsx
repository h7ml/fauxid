import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
      <h1 className="text-2xl font-medium">重置密码</h1>
      <p className="text-sm text-foreground/60">
        请在下方输入您的新密码。
      </p>
      <Label htmlFor="password">新密码</Label>
      <Input
        type="password"
        name="password"
        placeholder="请输入新密码"
        required
      />
      <Label htmlFor="confirmPassword">确认密码</Label>
      <Input
        type="password"
        name="confirmPassword"
        placeholder="请确认密码"
        required
      />
      <SubmitButton formAction={resetPasswordAction}>
        重置密码
      </SubmitButton>
      <FormMessage message={searchParams} />
    </form>
  );
}
