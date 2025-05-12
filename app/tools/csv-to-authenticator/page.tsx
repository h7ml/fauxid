import { Metadata } from "next";
import CsvToAuthenticator from "@/components/ui/csv-to-authenticator";
import { QrCode, ArrowLeft, Database } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "CSV转Authenticator - FauxID",
  description: "将CSV文件转换为Authenticator应用可扫描的QR码",
};

export default function CsvToAuthenticatorPage() {
  return (
    <div className="container py-8">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回主页
            </Link>
          </Button>
          <h1 className="text-3xl font-bold flex items-center">
            <QrCode className="mr-2 h-8 w-8" />
            CSV转Authenticator工具
          </h1>
          <p className="text-muted-foreground mt-2">
            将CSV格式的双因素认证密钥转换为Authenticator应用可扫描的QR码。
          </p>
        </div>
        <Button asChild>
          <Link href="/tools/csv-to-authenticator/saved-tokens">
            <Database className="mr-2 h-4 w-4" />
            查看已保存令牌
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">使用说明</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>上传包含认证信息的CSV文件，或直接粘贴CSV内容</li>
          <li>CSV文件应包含账户名称、密钥（必需）和发行者（可选）</li>
          <li>处理完成后，使用Google Authenticator、Microsoft Authenticator或其他TOTP应用扫描生成的QR码</li>
          <li>对于多个条目，可使用导航按钮逐个扫描</li>
          <li>登录后可以将令牌保存到您的账户中，方便后续使用</li>
        </ol>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">示例CSV格式</h2>
        <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
          <code>
            name,secret,issuer{"\n"}
            myaccount@example.com,JBSWY3DPEHPK3PXP,Google{"\n"}
            user123,BASE32SECRETKEY,Github
          </code>
        </pre>
        <p className="text-sm text-muted-foreground mt-2">
          注意：密钥必须是有效的Base32编码格式，通常由A-Z和2-7组成
        </p>
      </div>

      <CsvToAuthenticator />

      <div className="mt-10 p-4 border border-muted rounded-md">
        <h2 className="text-lg font-semibold mb-2">隐私说明</h2>
        <p className="text-sm text-muted-foreground">
          您的数据完全在本地处理，不会发送到任何服务器。QR码使用Google Charts API生成，仅传输加密后的URI。
          为安全起见，建议在处理完成后清除浏览器缓存和历史记录。
        </p>
      </div>
    </div>
  );
} 
