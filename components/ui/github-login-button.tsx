"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface GitHubLoginButtonProps {
  className?: string;
}

export function GitHubLoginButton({
  className,
}: GitHubLoginButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const handleClick = async () => {
    if (isPending) return;

    setIsPending(true);
    try {
      // 直接使用客户端的signIn方法处理
      const result = await signIn("github", {
        callbackUrl: "/protected",
        redirect: true
      });

      // 如果返回结果，则表示有错误或重定向被阻止
      if (result && !result.ok) {
        console.error("登录失败:", result.error);
        toast({
          title: "登录失败",
          description: result.error || "登录过程中发生错误",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("登录失败:", error);
      toast({
        title: "登录失败",
        description: "请检查网络连接或稍后再试",
        variant: "destructive",
      });
      setIsPending(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      variant="outline"
      className={cn(
        "w-full flex gap-2 items-center justify-center",
        isPending && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={isPending}
    >
      <Github className="h-4 w-4" />
      {isPending ? "正在连接..." : "使用 GitHub 登录"}
    </Button>
  );
} 
