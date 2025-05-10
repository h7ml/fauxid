"use client";

import { useSession, signOut } from "next-auth/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function NextAuthProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 提取用户首字母作为头像备用
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="max-w-md w-full mx-auto py-8">
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Next Auth 用户资料</CardTitle>
              <CardDescription>您通过 Linux.do 登录的账户信息</CardDescription>
            </div>
            <Avatar className="h-12 w-12">
              <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "用户头像"} />
              <AvatarFallback>{getInitials(session?.user?.name)}</AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">用户ID</h3>
              <p className="font-mono text-sm bg-muted p-2 rounded mt-1 break-all">{session?.user?.id || "未知"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">名称</h3>
              <p className="font-medium mt-1">{session?.user?.name || "未设置"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">电子邮件</h3>
              <p className="font-medium mt-1">{session?.user?.email || "未设置"}</p>
            </div>
            
            <div className="pt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">会话信息</h3>
              <div className="bg-muted p-3 rounded-md">
                <pre className="text-xs overflow-auto max-h-40 whitespace-pre-wrap">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={() => signOut({ callbackUrl: "/sign-in" })}
          >
            退出登录
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 