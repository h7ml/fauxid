"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Terminal } from "lucide-react";
import { useState } from "react";
import { signInWithLinuxDoAction } from "@/app/actions/oauth-actions";

interface LinuxDoLoginButtonProps {
  className?: string;
}

export function LinuxDoLoginButton({
  className,
}: LinuxDoLoginButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    if (isPending) return;

    setIsPending(true);
    try {
      await signInWithLinuxDoAction();
    } catch (error) {
      console.error("登录失败:", error);
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
      <Terminal className="h-4 w-4" />
      {isPending ? "正在连接..." : "使用 Linux.do 登录"}
    </Button>
  );
} 
