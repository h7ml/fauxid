"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <h2 className="text-2xl font-bold">发生了一个错误</h2>
        <p className="text-muted-foreground">抱歉，请求处理过程中出现问题。</p>
        {error.message && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md text-sm my-4">
            {error.message}
          </div>
        )}
        <Button onClick={reset} className="mt-4">
          重试
        </Button>
      </div>
    </div>
  );
} 
