import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              variant={"default"}
              className="font-normal pointer-events-none"
            >
              请更新 .env.local 文件，添加 anon key 和 url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              variant={"outline"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-in">登录</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-up">注册</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  return user ? (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 mr-2">
        <Link href="/" className="text-sm font-medium hover:underline">首页</Link>
        <Link href="/protected/identities" className="text-sm font-medium hover:underline">身份管理</Link>
      </div>
      <div className="flex items-center gap-4">
        您好，{user.email}!
        <form action={signOutAction}>
          <Button type="submit" variant={"outline"} size="sm">
            退出登录
          </Button>
        </form>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-4">
      <Link href="/" className="text-sm font-medium hover:underline mr-4">首页</Link>
      <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/sign-in">登录</Link>
        </Button>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/sign-up">注册</Link>
        </Button>
      </div>
    </div>
  );
}
