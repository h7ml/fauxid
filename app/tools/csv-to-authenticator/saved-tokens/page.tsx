import { Metadata } from "next";
import AuthenticatorTokenList from "@/components/ui/authenticator-token-list";
import { QrCode, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "已保存的认证令牌 - FauxID",
  description: "管理您保存的认证令牌",
};

export default function SavedTokensPage() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/tools/csv-to-authenticator">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回转换工具
          </Link>
        </Button>
        <h1 className="text-3xl font-bold flex items-center">
          <QrCode className="mr-2 h-8 w-8" />
          已保存的认证令牌
        </h1>
        <p className="text-muted-foreground mt-2">
          查看和管理您保存的所有认证令牌
        </p>
      </div>

      <AuthenticatorTokenList />

      <div className="mt-8 flex justify-center">
        <Button asChild>
          <Link href="/tools/csv-to-authenticator">
            <QrCode className="mr-2 h-4 w-4" />
            添加更多令牌
          </Link>
        </Button>
      </div>
    </div>
  );
} 
