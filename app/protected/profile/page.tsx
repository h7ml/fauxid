import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Globe, Key, Mail, Shield, User, UserCheck } from "lucide-react";
import AvatarUpload from "@/components/profile/avatar-upload";

export const metadata: Metadata = {
  title: "个人资料 | FauxID",
  description: "查看和管理您的个人资料",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // 获取用户注册时间
  const createdAt = user.created_at ? new Date(user.created_at) : null;
  const formattedCreatedAt = createdAt
    ? createdAt.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    : '未知';

  // 获取上次登录时间
  const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at) : null;
  const formattedLastSignIn = lastSignIn
    ? lastSignIn.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    : '未知';

  // 获取用户头像URL
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="container max-w-7xl mx-auto py-8">
      <div className="mb-8 flex items-center">
        <Link href="/protected">
          <Button variant="ghost" className="p-0 h-auto mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">个人资料</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 左侧个人信息卡片 */}
        <div className="md:col-span-1">
          <Card className="overflow-hidden border-border/30 hover-card-effect">
            <div className="bg-primary/5 p-8 flex flex-col items-center">
              <AvatarUpload
                initialAvatarUrl={avatarUrl}
                email={user.email}
              />
              <h2 className="text-xl font-bold">{user.email?.split('@')[0]}</h2>
              <p className="text-muted-foreground mt-1 text-sm break-all text-center">{user.email}</p>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-primary" />
                  <span className="text-sm">已验证账户</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">注册于 {formattedCreatedAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">用户ID: {user.id.substring(0, 8)}...</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/30">
                <Link href="/protected/reset-password">
                  <Button variant="outline" className="w-full">
                    <Key className="w-4 h-4 mr-2" />
                    更改密码
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧详细信息 */}
        <div className="md:col-span-2">
          <Card className="border-border/30 hover-card-effect h-full">
            <CardHeader>
              <CardTitle>账户信息</CardTitle>
              <CardDescription>您的详细账户信息和设置</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    账户详情
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">邮箱地址</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">用户ID</p>
                        <p className="font-medium font-mono text-sm">{user.id}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    邮箱验证状态
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={user.email_confirmed_at ? "font-medium" : "text-muted-foreground"}>
                          {user.email_confirmed_at ? "已验证" : "未验证"}
                        </p>
                        {user.email_confirmed_at && (
                          <p className="text-xs text-muted-foreground">
                            验证时间: {new Date(user.email_confirmed_at).toLocaleDateString('zh-CN')}
                          </p>
                        )}
                      </div>
                      {!user.email_confirmed_at && (
                        <Button variant="outline" size="sm">
                          重新发送验证邮件
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    登录记录
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">上次登录时间</p>
                      <p className="font-medium">{formattedLastSignIn}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">系统信息</h3>
                  <pre className="text-xs font-mono p-3 rounded bg-muted/50 overflow-auto max-h-48 border border-border/30">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
