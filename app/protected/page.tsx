import { createClient } from "@/utils/supabase/server";
import { InfoIcon, User, Shield, Key, FileText, Settings } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          这是一个受保护的页面，只有已认证的用户才能查看
        </div>
      </div>

      {/* 用户欢迎区域 */}
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <Avatar className="h-20 w-20 bg-primary/10">
          <AvatarFallback className="text-primary text-2xl">
            {user.email?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-center sm:text-left">
          <h1 className="text-2xl font-bold mb-2">欢迎回来！</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="mt-4">
            <Link href="/protected/profile" className="text-primary hover:underline">
              查看个人资料
            </Link>
          </div>
        </div>
      </div>

      {/* 功能卡片 */}
      <div>
        <h2 className="font-bold text-2xl mb-6">管理中心</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/protected/identities" className="block">
            <Card className="hover:shadow-md transition-shadow h-full hover:border-primary/30 hover-card-effect">
              <CardHeader className="pb-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>身份信息管理</CardTitle>
                <CardDescription>管理已生成的虚拟身份信息</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  创建、查看和删除虚拟身份信息，并设置收藏标记。
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/protected/profile" className="block">
            <Card className="hover:shadow-md transition-shadow h-full hover:border-primary/30 hover-card-effect">
              <CardHeader className="pb-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>个人资料</CardTitle>
                <CardDescription>查看和更新您的账户信息</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  管理您的个人信息和账户设置。
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/protected/reset-password" className="block">
            <Card className="hover:shadow-md transition-shadow h-full hover:border-primary/30 hover-card-effect">
              <CardHeader className="pb-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Key className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>安全设置</CardTitle>
                <CardDescription>更新您的密码和安全选项</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  修改密码和管理账户安全设置。
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
