"use client";

import AuthenticatorTokenList from "@/components/ui/authenticator-token-list";
import { QrCode, ArrowLeft, Database, Upload, DownloadCloud, Layers, AlertTriangle, Trash, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getUserAuthenticatorTokens, deleteAuthenticatorToken } from "@/app/actions/authenticator-actions";
import { useToast } from "@/components/ui/use-toast";

export default function SavedTokensPageClient() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingAllTokens, setDeletingAllTokens] = useState(false);
  const { toast } = useToast();

  // 删除所有令牌
  const handleDeleteAllTokens = async () => {
    try {
      setDeletingAllTokens(true);
      const response = await getUserAuthenticatorTokens();

      if (!response.success || !response.data) {
        toast({
          title: "获取令牌失败",
          description: response.error || "获取令牌列表失败",
          variant: "destructive",
        });
        setDeletingAllTokens(false);
        setShowDeleteDialog(false);
        return;
      }

      const tokens = response.data;
      if (tokens.length === 0) {
        toast({
          title: "没有需要删除的令牌",
          description: "令牌列表为空"
        });
        setDeletingAllTokens(false);
        setShowDeleteDialog(false);
        return;
      }

      let successCount = 0;
      let failCount = 0;

      // 逐个删除所有令牌
      for (const token of tokens) {
        if (!token.id) continue;
        const response = await deleteAuthenticatorToken(token.id);
        if (response.success) {
          successCount++;
        } else {
          failCount++;
        }
      }

      if (successCount > 0) {
        toast({
          title: "批量删除完成",
          description: `成功删除 ${successCount} 个令牌${failCount > 0 ? `，${failCount} 个删除失败` : ''}`
        });

        // 刷新页面以显示更新后的状态
        window.location.reload();
      } else {
        toast({
          title: "删除失败",
          description: "未能删除任何令牌",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("批量删除令牌时发生错误:", error);
      toast({
        title: "操作失败",
        description: "批量删除令牌时发生未知错误",
        variant: "destructive"
      });
    } finally {
      setDeletingAllTokens(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="container max-w-5xl py-6 md:py-8">
      <div className="mb-6 space-y-2">
        <Button variant="ghost" size="sm" asChild className="group mb-2">
          <Link href="/tools/csv-to-authenticator" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">返回转换工具</span>
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
              <QrCode className="mr-3 h-8 w-8 md:h-10 md:w-10 text-cyber-blue" />
              已保存的认证令牌
            </h1>
            <p className="text-muted-foreground mt-2">
              查看、管理和导出您的认证令牌集合
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-2 shadow-sm w-full sm:w-auto border-border/30 bg-background/60 backdrop-blur-sm"
            >
              <Link href="/tools/csv-to-authenticator">
                <Upload className="h-4 w-4 text-cyber-blue" />
                导入新令牌
              </Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-2 shadow-sm w-full sm:w-auto border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-500"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash className="h-4 w-4" />
              一键删除全部
            </Button>
          </div>
        </div>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/5 to-cyber-purple/5 rounded-lg -m-2 blur-3xl opacity-30 pointer-events-none"></div>
        <AuthenticatorTokenList hideHeader={true} />
      </div>

      <div className="mt-10 flex flex-col gap-4 items-center text-center max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <div className="p-4 rounded-lg border border-border/30 bg-background/60 backdrop-blur-sm flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-cyber-blue/10 flex items-center justify-center mb-2">
              <QrCode className="h-5 w-5 text-cyber-blue" />
            </div>
            <h3 className="font-medium">安全存储</h3>
            <p className="text-xs text-muted-foreground mt-1">所有令牌均加密存储</p>
          </div>

          <div className="p-4 rounded-lg border border-border/30 bg-background/60 backdrop-blur-sm flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-cyber-purple/10 flex items-center justify-center mb-2">
              <Database className="h-5 w-5 text-cyber-purple" />
            </div>
            <h3 className="font-medium">跨设备同步</h3>
            <p className="text-xs text-muted-foreground mt-1">在任何设备上访问</p>
          </div>

          <div className="p-4 rounded-lg border border-border/30 bg-background/60 backdrop-blur-sm flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-cyber-pink/10 flex items-center justify-center mb-2">
              <DownloadCloud className="h-5 w-5 text-cyber-pink" />
            </div>
            <h3 className="font-medium">数据导出</h3>
            <p className="text-xs text-muted-foreground mt-1">支持CSV格式导出</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div className="p-4 rounded-lg border border-border/30 bg-background/60 backdrop-blur-sm flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
              <Layers className="h-5 w-5 text-amber-500" />
            </div>
            <h3 className="font-medium">重复检测</h3>
            <p className="text-xs text-muted-foreground mt-1">
              自动识别并标记具有相同密钥的令牌
            </p>
          </div>

          <div className="p-4 rounded-lg border border-border/30 bg-background/60 backdrop-blur-sm flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <h3 className="font-medium">一键清理</h3>
            <p className="text-xs text-muted-foreground mt-1">
              自动清理重复令牌，保留最新添加的条目
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          推荐使用 Google Authenticator、Microsoft Authenticator 等TOTP应用程序扫描令牌QR码
        </p>
      </div>

      {/* 删除全部令牌确认对话框 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              删除全部认证令牌
            </DialogTitle>
            <DialogDescription>
              此操作将删除您所有的认证令牌，包括收藏的令牌。
            </DialogDescription>
          </DialogHeader>

          <div className="py-3">
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-sm">
              <p className="mb-2">警告：</p>
              <p>• 删除后将无法恢复</p>
              <p>• 包括收藏的令牌也会被删除</p>
              <div className="h-px bg-red-500/20 my-2"></div>
              <p className="text-red-500 font-medium">此操作将清空您的所有令牌！</p>
            </div>

            <p className="text-sm mt-3 text-muted-foreground">
              操作完成后将自动刷新页面。确认继续？
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAllTokens}
              disabled={deletingAllTokens}
            >
              {deletingAllTokens ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  删除中...
                </>
              ) : (
                "确认删除全部"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
