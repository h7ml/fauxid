import { createClient } from "@/utils/supabase/server";
import { InfoIcon, User, Shield, Key, Image as ImageIcon, Settings, FileText, BookOpen } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      {/* 页面标题和欢迎区域 */}
      <section className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/3">
            <div className="bg-card border border-border/50 rounded-xl p-6 mb-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row md:flex-col items-center gap-4 text-center md:text-center">
                <Avatar className="h-20 w-20 bg-primary/10 ring-4 ring-background">
                  <AvatarFallback className="text-primary text-2xl font-semibold">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold mb-2">欢迎回来！</h1>
                  <p className="text-muted-foreground break-all">{user.email}</p>
                  <div className="mt-4">
                    <Link href="/protected/profile">
                      <Button variant="outline" size="sm" className="w-full">
                        <User size={14} className="mr-2" />
                        查看个人资料
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/30 text-sm p-4 rounded-xl text-foreground flex gap-3 items-start border border-accent">
              <InfoIcon size="18" className="mt-0.5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">安全提示</p>
                <p className="text-muted-foreground text-xs">这是一个受保护的页面，用于管理您的虚拟身份和账户信息。</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <h2 className="font-bold text-2xl mb-4">快速访问</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/protected/identities" className="block">
                <Card className="hover:shadow-md transition-all h-full border-border/50 hover:border-primary/30 hover:scale-[1.01] hover-card-effect">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-60">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </Button>
                    </div>
                    <CardTitle className="text-lg mt-2">身份信息管理</CardTitle>
                    <CardDescription>管理已生成的虚拟身份信息</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      创建、查看和删除虚拟身份信息，并设置收藏标记。
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/protected/profile" className="block">
                <Card className="hover:shadow-md transition-all h-full border-border/50 hover:border-primary/30 hover:scale-[1.01] hover-card-effect">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-60">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </Button>
                    </div>
                    <CardTitle className="text-lg mt-2">个人资料</CardTitle>
                    <CardDescription>查看和更新您的账户信息</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      管理您的个人信息和账户设置。
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/protected/reset-password" className="block">
                <Card className="hover:shadow-md transition-all h-full border-border/50 hover:border-primary/30 hover:scale-[1.01] hover-card-effect">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Key className="h-5 w-5 text-primary" />
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-60">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </Button>
                    </div>
                    <CardTitle className="text-lg mt-2">安全设置</CardTitle>
                    <CardDescription>更新您的密码和安全选项</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      修改密码和管理账户安全设置。
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/protected/images" className="block">
                <Card className="hover:shadow-md transition-all h-full border-border/50 hover:border-primary/30 hover:scale-[1.01] hover-card-effect">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-primary" />
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-60">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </Button>
                    </div>
                    <CardTitle className="text-lg mt-2">图像管理</CardTitle>
                    <CardDescription>管理您上传的图像</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      上传、查看和删除您的图像。
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 推荐工具 */}
      <section className="w-full max-w-5xl mx-auto">
        <h2 className="font-bold text-2xl mb-4">推荐工具</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/books" className="bg-card border border-border/50 rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow hover:border-primary/30 hover:scale-[1.02]">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium">图书管理</h3>
            <p className="text-xs text-muted-foreground mt-1">浏览您收藏的图书</p>
          </Link>

          <Link href="/notes" className="bg-card border border-border/50 rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow hover:border-primary/30 hover:scale-[1.02]">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium">笔记工具</h3>
            <p className="text-xs text-muted-foreground mt-1">管理您的个人笔记</p>
          </Link>

          <Link href="/tools/csv-to-authenticator" className="bg-card border border-border/50 rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow hover:border-primary/30 hover:scale-[1.02]">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                <rect width="16" height="16" x="4" y="4" rx="2" />
                <path d="M4 12h16" />
                <path d="M12 4v16" />
              </svg>
            </div>
            <h3 className="font-medium">CSV转Authenticator</h3>
            <p className="text-xs text-muted-foreground mt-1">转换双因素认证密钥</p>
          </Link>

          <Link href="/protected" className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow hover:border-primary/40 hover:scale-[1.02]">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium">更多工具</h3>
            <p className="text-xs text-muted-foreground mt-1">探索更多功能和工具</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
