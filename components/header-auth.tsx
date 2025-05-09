import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Home, User, Shield } from "lucide-react";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <div className="flex gap-4 items-center">
        <Badge
          variant={"outline"}
          className="font-normal bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
        >
          需要设置 Supabase 环境变量
        </Badge>
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
    );
  }

  return user ? (
    <div className="flex items-center gap-6">
      <div className="hidden md:flex items-center gap-4">
        <Link
          href="/"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
        >
          <Home className="h-4 w-4" />
          <span>首页</span>
        </Link>
        <Link
          href="/protected/identities"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
        >
          <Shield className="h-4 w-4" />
          <span>身份管理</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 bg-primary/10">
            <AvatarFallback className="text-primary">
              {user.email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">{user.email}</p>
          </div>
        </div>
        <form action={signOutAction}>
          <Button type="submit" variant={"outline"} size="sm" className="gap-1.5">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline-block">退出登录</span>
          </Button>
        </form>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-4">
      <Link
        href="/"
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:flex items-center gap-1.5"
      >
        <Home className="h-4 w-4" />
        <span>首页</span>
      </Link>

      <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"} className="gap-1.5">
          <Link href="/sign-in">
            <User className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline-block">登录</span>
          </Link>
        </Button>
        <Button asChild size="sm" variant={"default"} className="hidden sm:flex">
          <Link href="/sign-up">注册</Link>
        </Button>
      </div>
    </div>
  );
}
