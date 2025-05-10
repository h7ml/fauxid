"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function GlobalError({
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
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md space-y-4 text-center">
            <h2 className="text-2xl font-bold">应用程序错误</h2>
            <p className="text-muted-foreground">抱歉，应用程序发生了严重错误。</p>
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
      </body>
    </html>
  );
} 
