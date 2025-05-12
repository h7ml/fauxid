"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, AlertCircle, Download, Upload, Import, QrCode, Database, Save } from "lucide-react";
import { saveAuthenticatorToken, saveMultipleAuthenticatorTokens, AuthenticatorToken } from "@/app/actions/authenticator-actions";

interface AuthenticatorEntry {
  name: string;
  secret: string;
  issuer?: string;
  type?: string;
  algorithm?: string;
  digits?: number;
  period?: number;
}

export default function CsvToAuthenticator() {
  const [csvContent, setCsvContent] = useState<string>("");
  const [parsedEntries, setParsedEntries] = useState<AuthenticatorEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedTokenIds, setSavedTokenIds] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvContent(content);
      parseCSV(content);
    };
    reader.readAsText(file);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setCsvContent(content);
  };

  const parseCSV = (content: string) => {
    try {
      setError(null);
      // 分割CSV行
      const lines = content.split(/\r?\n/).filter(line => line.trim() !== "");

      // 检查是否有内容
      if (lines.length === 0) {
        setError("CSV文件为空");
        setParsedEntries([]);
        return;
      }

      // 分析表头（如果有）并找到相关列
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const nameIndex = headers.findIndex(h => ['name', 'account', '名称', '账户'].includes(h));
      const secretIndex = headers.findIndex(h => ['secret', 'key', 'token', '密钥', '令牌'].includes(h));
      const issuerIndex = headers.findIndex(h => ['issuer', 'provider', '发行者', '提供商'].includes(h));

      const hasHeaders = nameIndex !== -1 && secretIndex !== -1;
      const startIndex = hasHeaders ? 1 : 0;

      const entries: AuthenticatorEntry[] = [];

      // 处理每一行
      for (let i = startIndex; i < lines.length; i++) {
        const columns = lines[i].split(',').map(col => col.trim());

        if (hasHeaders) {
          // 使用表头解析
          const name = columns[nameIndex];
          const secret = columns[secretIndex];
          const issuer = issuerIndex !== -1 ? columns[issuerIndex] : undefined;

          if (name && secret) {
            entries.push({
              name,
              secret,
              issuer,
              type: "totp",
              algorithm: "SHA1",
              digits: 6,
              period: 30
            });
          }
        } else {
          // 假设CSV格式为: 名称,密钥,发行者(可选)
          if (columns.length >= 2) {
            const [name, secret, issuer] = columns;
            entries.push({
              name,
              secret,
              issuer,
              type: "totp",
              algorithm: "SHA1",
              digits: 6,
              period: 30
            });
          }
        }
      }

      if (entries.length === 0) {
        setError("无法从CSV解析出有效数据。请确保CSV包含名称和密钥列。");
        setParsedEntries([]);
        return;
      }

      setParsedEntries(entries);
      setSavedTokenIds(new Set());
      setCurrentIndex(0);
      generateQrCode(entries[0]);

      toast({
        title: "CSV解析成功",
        description: `已成功解析 ${entries.length} 个认证条目`,
      });
    } catch (err) {
      console.error("解析CSV时发生错误:", err);
      setError("解析CSV时发生错误，请检查文件格式");
      setParsedEntries([]);
    }
  };

  const generateQrCode = (entry: AuthenticatorEntry) => {
    // 生成otpauth URI
    // otpauth://totp/ISSUER:ACCOUNT?secret=SECRET&issuer=ISSUER&algorithm=SHA1&digits=6&period=30
    let uri = `otpauth://${entry.type || 'totp'}/`;

    if (entry.issuer) {
      uri += `${encodeURIComponent(entry.issuer)}:`;
    }

    uri += `${encodeURIComponent(entry.name)}?secret=${entry.secret}`;

    if (entry.issuer) {
      uri += `&issuer=${encodeURIComponent(entry.issuer)}`;
    }

    if (entry.algorithm) {
      uri += `&algorithm=${entry.algorithm}`;
    }

    if (entry.digits) {
      uri += `&digits=${entry.digits}`;
    }

    if (entry.period) {
      uri += `&period=${entry.period}`;
    }

    // 使用Google Charts API生成QR码
    const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(uri)}&choe=UTF-8`;
    setQrCodeUrl(qrUrl);
  };

  const handleNext = () => {
    if (currentIndex < parsedEntries.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      generateQrCode(parsedEntries[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      generateQrCode(parsedEntries[prevIndex]);
    }
  };

  const handleProcess = () => {
    parseCSV(csvContent);
    setActiveTab("qrcodes");
  };

  const handleClearAll = () => {
    setCsvContent("");
    setParsedEntries([]);
    setError(null);
    setQrCodeUrl(null);
    setCurrentIndex(0);
    setSavedTokenIds(new Set());
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 保存当前显示的令牌到数据库
  const handleSaveCurrentToken = async () => {
    if (parsedEntries.length === 0) return;

    try {
      setIsSaving(true);

      const currentToken = parsedEntries[currentIndex];
      const tokenToSave: AuthenticatorToken = {
        name: currentToken.name,
        secret: currentToken.secret,
        issuer: currentToken.issuer,
        type: currentToken.type || "totp",
        algorithm: currentToken.algorithm || "SHA1",
        digits: currentToken.digits || 6,
        period: currentToken.period || 30
      };

      const response = await saveAuthenticatorToken(tokenToSave);

      if (response.success) {
        const newSavedTokenIds = new Set(savedTokenIds);
        newSavedTokenIds.add(currentIndex);
        setSavedTokenIds(newSavedTokenIds);

        toast({
          title: "保存成功",
          description: `已成功保存认证令牌: ${currentToken.name}`,
        });
      } else {
        toast({
          title: "保存失败",
          description: response.error || "保存令牌时发生错误",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("保存令牌时发生错误:", error);
      toast({
        title: "保存失败",
        description: "保存令牌时发生未知错误",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 批量保存所有解析的令牌到数据库
  const handleSaveAllTokens = async () => {
    if (parsedEntries.length === 0) return;

    try {
      setIsSaving(true);

      const tokensToSave: AuthenticatorToken[] = parsedEntries.map(entry => ({
        name: entry.name,
        secret: entry.secret,
        issuer: entry.issuer,
        type: entry.type || "totp",
        algorithm: entry.algorithm || "SHA1",
        digits: entry.digits || 6,
        period: entry.period || 30
      }));

      const response = await saveMultipleAuthenticatorTokens(tokensToSave);

      if (response.success) {
        // 标记所有令牌为已保存
        const allIndices = new Set(Array.from({ length: parsedEntries.length }, (_, i) => i));
        setSavedTokenIds(allIndices);

        toast({
          title: "批量保存成功",
          description: `已成功保存 ${parsedEntries.length} 个认证令牌`,
        });
      } else {
        toast({
          title: "批量保存失败",
          description: response.error || "保存令牌时发生错误",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("批量保存令牌时发生错误:", error);
      toast({
        title: "批量保存失败",
        description: "保存令牌时发生未知错误",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isCurrentTokenSaved = savedTokenIds.has(currentIndex);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">CSV转Authenticator</CardTitle>
          <CardDescription>
            将CSV文件转换为Authenticator应用可扫描的QR码
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="upload">上传CSV</TabsTrigger>
              <TabsTrigger value="qrcodes" disabled={parsedEntries.length === 0}>
                QR码 ({parsedEntries.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <div className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="csv-file">上传CSV文件</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  <p className="text-sm text-muted-foreground">
                    CSV应包含：账户名称、密钥（必需）、发行者（可选）
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="csv-content">或粘贴CSV内容</Label>
                  <Textarea
                    id="csv-content"
                    placeholder="name,secret,issuer&#10;account1,JBSWY3DPEHPK3PXP,Google&#10;account2,BASE32SECRETKEY,Microsoft"
                    value={csvContent}
                    onChange={handleTextareaChange}
                    className="min-h-[150px] font-mono"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>错误</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleClearAll}>
                    清除
                  </Button>
                  <Button onClick={handleProcess} disabled={!csvContent.trim()}>
                    <Import className="mr-2 h-4 w-4" />
                    处理CSV
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="qrcodes">
              {parsedEntries.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">
                      {currentIndex + 1} / {parsedEntries.length}
                    </p>
                    <Progress value={(currentIndex + 1) / parsedEntries.length * 100} className="w-1/2" />
                  </div>

                  <div className="p-4 border rounded-lg flex flex-col items-center justify-center">
                    <div className="mb-2 flex flex-col items-center">
                      <h3 className="font-bold text-lg">{parsedEntries[currentIndex].name}</h3>
                      {parsedEntries[currentIndex].issuer && (
                        <span className="text-sm text-muted-foreground">
                          {parsedEntries[currentIndex].issuer}
                        </span>
                      )}
                    </div>

                    {qrCodeUrl && (
                      <div className="relative p-2 bg-white rounded-lg">
                        <img
                          src={qrCodeUrl}
                          alt="Authentication QR Code"
                          className="w-[250px] h-[250px]"
                        />
                      </div>
                    )}

                    <div className="mt-4 space-y-1 w-full">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">类型:</span>
                        <span className="text-sm">{parsedEntries[currentIndex].type || "TOTP"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">密钥:</span>
                        <span className="text-sm font-mono">{parsedEntries[currentIndex].secret}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">算法:</span>
                        <span className="text-sm">{parsedEntries[currentIndex].algorithm || "SHA1"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">位数:</span>
                        <span className="text-sm">{parsedEntries[currentIndex].digits || 6}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">周期:</span>
                        <span className="text-sm">{parsedEntries[currentIndex].period || 30}秒</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentIndex === 0}
                    >
                      上一个
                    </Button>
                    <Button
                      onClick={() => setActiveTab("upload")}
                      variant="outline"
                    >
                      返回
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={currentIndex === parsedEntries.length - 1}
                    >
                      下一个
                    </Button>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">保存到数据库</p>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveCurrentToken}
                          disabled={isSaving || isCurrentTokenSaved}
                          variant={isCurrentTokenSaved ? "ghost" : "outline"}
                          className={isCurrentTokenSaved ? "text-green-500" : ""}
                        >
                          {isCurrentTokenSaved ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              已保存
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              保存此令牌
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={handleSaveAllTokens}
                          disabled={isSaving || savedTokenIds.size === parsedEntries.length}
                          variant="default"
                        >
                          <Database className="mr-2 h-4 w-4" />
                          {isSaving ? "保存中..." : "保存全部"}
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      登录后可以将令牌保存到您的账户中，方便后续使用
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-xs text-muted-foreground">
            Authenticator兼容于Google Authenticator、Microsoft Authenticator和其他TOTP应用
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 
