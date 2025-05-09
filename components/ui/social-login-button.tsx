"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Github } from "lucide-react";
import { useState } from "react";

interface SocialLoginButtonProps {
  provider: "github";
  formAction: (formData: FormData) => Promise<void>;
  className?: string;
}

export function SocialLoginButton({
  provider,
  formAction,
  className,
}: SocialLoginButtonProps) {
  const [isPending, setIsPending] = useState(false);

  // 内部处理图标选择
  const getIcon = () => {
    switch (provider) {
      case "github":
        return <Github className="h-4 w-4" />;
      default:
        return <Github className="h-4 w-4" />;
    }
  };

  // 获取显示名称
  const getProviderName = () => {
    switch (provider) {
      case "github":
        return "GitHub";
      default:
        return provider;
    }
  };

  // 处理点击事件
  const handleClick = async () => {
    if (isPending) return;

    setIsPending(true);
    try {
      const data = new FormData();
      await formAction(data);
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
      {getIcon()}
      {isPending ? "正在连接..." : `使用 ${getProviderName()} 登录`}
    </Button>
  );
} 
