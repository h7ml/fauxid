"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Github } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";

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
      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error("登录失败:", error.message);
        toast({
          title: "登录失败",
          description: error.message || "登录过程中发生错误",
          variant: "destructive",
        });
        setIsPending(false);
      } else if (data) {
        // Redirect happens automatically
        window.location.href = data.url;
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
