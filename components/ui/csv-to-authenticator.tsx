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
import { 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Upload, 
  Import, 
  QrCode, 
  Database, 
  Save, 
  Copy, 
  FileDown, 
  FileUp, 
  Clipboard, 
  ClipboardCopy, 
  RefreshCw,
  AlertOctagon,
  Check,
  X
} from "lucide-react";
import { 
  saveAuthenticatorToken, 
  saveMultipleAuthenticatorTokens, 
  checkAndImportAuthenticatorTokens,
  updateDuplicateAuthenticatorTokens,
  AuthenticatorToken 
} from "@/app/actions/authenticator-actions";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface AuthenticatorEntry {
  name: string;
  secret: string;
  issuer?: string;
  type?: string;
  algorithm?: string;
  digits?: number;
  period?: number;
}

// 定义导入令牌的结果接口
interface ImportResult {
  newTokens: AuthenticatorEntry[];
  duplicates: Array<{
    existing: AuthenticatorToken;
    new: AuthenticatorEntry;
  }>;
  selected: string[]; // 选中的要更新的重复项ID
}

// 添加的工具函数，用于解析OTP URI
const parseOtpUri = (uri: string): AuthenticatorEntry | null => {
  try {
    // otpauth://totp/ISSUER:ACCOUNT?secret=SECRET&issuer=ISSUER&algorithm=SHA1&digits=6&period=30
    const otpUriPattern = /^otpauth:\/\/(totp|hotp)\/([^?]+)\?(.+)$/i;
    const match = uri.match(otpUriPattern);
    
    if (!match) return null;
    
    const [_, type, labelPart, queryPart] = match;
    
    // 解析查询参数
    const params = new URLSearchParams(queryPart);
    const secret = params.get('secret');
    
    if (!secret) return null;
    
    // 解析标签部分：可能是 "Issuer:Account" 或仅 "Account"
    let name: string, issuer: string | undefined;
    
    if (labelPart.includes(':')) {
      const parts = decodeURIComponent(labelPart).split(':');
      issuer = parts[0];
      name = parts[1];
    } else {
      name = decodeURIComponent(labelPart);
      issuer = params.get('issuer') || undefined;
    }
    
    // 如果URI中包含issuer参数，优先使用它
    if (params.get('issuer')) {
      issuer = params.get('issuer') || undefined;
    }
    
    return {
      name,
      secret,
      issuer,
      type: type.toLowerCase(),
      algorithm: (params.get('algorithm') || 'SHA1').toUpperCase(),
      digits: params.get('digits') ? parseInt(params.get('digits')!) : 6,
      period: params.get('period') ? parseInt(params.get('period')!) : 30
    };
  } catch (error) {
    console.error('解析OTP URI时发生错误:', error);
    return null;
  }
};

// 解析JSON格式的令牌数据
const parseJsonTokens = (jsonText: string): AuthenticatorEntry[] => {
  try {
    const parsed = JSON.parse(jsonText);
    
    // 如果是数组，直接处理
    if (Array.isArray(parsed)) {
      return parsed.filter(item => item.name && item.secret).map(item => ({
        name: item.name,
        secret: item.secret,
        issuer: item.issuer,
        type: item.type || "totp",
        algorithm: item.algorithm || "SHA1",
        digits: item.digits || 6,
        period: item.period || 30
      }));
    }
    
    // 如果是单个对象，且有必要字段
    if (parsed && typeof parsed === 'object' && parsed.name && parsed.secret) {
      return [{
        name: parsed.name,
        secret: parsed.secret,
        issuer: parsed.issuer,
        type: parsed.type || "totp",
        algorithm: parsed.algorithm || "SHA1",
        digits: parsed.digits || 6,
        period: parsed.period || 30
      }];
    }
    
    // 处理可能的嵌套结构，比如 {tokens: [...]}
    if (parsed && typeof parsed === 'object') {
      for (const key in parsed) {
        if (Array.isArray(parsed[key]) && parsed[key].length > 0) {
          return parsed[key].filter(item => item.name && item.secret).map(item => ({
            name: item.name,
            secret: item.secret,
            issuer: item.issuer,
            type: item.type || "totp",
            algorithm: item.algorithm || "SHA1",
            digits: item.digits || 6,
            period: item.period || 30
          }));
        }
      }
    }
    
    return [];
  } catch (error) {
    console.error('解析JSON数据时发生错误:', error);
    return [];
  }
};

export default function CsvToAuthenticator() {
  const [csvContent, setCsvContent] = useState<string>("");
  const [parsedEntries, setParsedEntries] = useState<AuthenticatorEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeUri, setQrCodeUri] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedTokenIds, setSavedTokenIds] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 导入导出相关状态
  const [clipboardImportContent, setClipboardImportContent] = useState<string>("");
  const [importFileInputRef, setImportFileInputRef] = useState<HTMLInputElement | null>(null);
  const [exportFormat, setExportFormat] = useState<string>("json");
  const [exportRange, setExportRange] = useState<string>("current");
  const [fileExportFormat, setFileExportFormat] = useState<string>("json");
  const [fileExportRange, setFileExportRange] = useState<string>("current");
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showImportDialog, setShowImportDialog] = useState<boolean>(false);
  const [selectedTokensToImport, setSelectedTokensToImport] = useState<string[]>([]);
  
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

    // 存储URI用于客户端QR码生成
    setQrCodeUri(uri);
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
    setQrCodeUri("");
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

  // 添加下载QR码图片功能
  const handleDownloadQR = () => {
    if (!qrCodeUri) return;
    
    const canvas = document.createElement("canvas");
    const svgElement = document.getElementById("qr-code-svg");
    
    if (!svgElement) return;
    
    const svgData = new XMLSerializer().serializeToString(svgElement);
    // 使用更安全的编码方法，处理Unicode字符
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      // 释放对象URL
      URL.revokeObjectURL(url);
      
      const pngFile = canvas.toDataURL("image/png");
      
      // 创建下载链接
      const downloadLink = document.createElement("a");
      const fileName = `${parsedEntries[currentIndex].name.replace(/[^\w\s]/gi, '_')}_qr.png`;
      
      downloadLink.download = fileName;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = url;
  };

  // 处理剪贴板文本变化
  const handleClipboardImportChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setClipboardImportContent(e.target.value);
  };

  // 清除剪贴板导入内容
  const handleClearClipboardImport = () => {
    setClipboardImportContent("");
  };

  // 解析导入的文本数据
  const parseImportContent = (content: string): AuthenticatorEntry[] => {
    try {
      setError(null);
      let entries: AuthenticatorEntry[] = [];
      
      // 首先尝试解析为JSON
      if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
        entries = parseJsonTokens(content);
        if (entries.length > 0) {
          return entries;
        }
      }
      
      // 如果JSON解析失败，尝试解析为CSV
      if (content.includes(',')) {
        try {
          // 使用现有的CSV解析函数
          const tempEntries: AuthenticatorEntry[] = [];
          const lines = content.split(/\r?\n/).filter(line => line.trim() !== "");
          
          // 检查是否有内容
          if (lines.length === 0) return [];
          
          // 分析表头（如果有）并找到相关列
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          const nameIndex = headers.findIndex(h => ['name', 'account', '名称', '账户'].includes(h));
          const secretIndex = headers.findIndex(h => ['secret', 'key', 'token', '密钥', '令牌'].includes(h));
          const issuerIndex = headers.findIndex(h => ['issuer', 'provider', '发行者', '提供商'].includes(h));
          
          const hasHeaders = nameIndex !== -1 && secretIndex !== -1;
          const startIndex = hasHeaders ? 1 : 0;
          
          // 处理每一行
          for (let i = startIndex; i < lines.length; i++) {
            const columns = lines[i].split(',').map(col => col.trim());
            
            if (hasHeaders) {
              // 使用表头解析
              const name = columns[nameIndex];
              const secret = columns[secretIndex];
              const issuer = issuerIndex !== -1 ? columns[issuerIndex] : undefined;
              
              if (name && secret) {
                tempEntries.push({
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
                tempEntries.push({
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
          
          if (tempEntries.length > 0) {
            entries = tempEntries;
            return entries;
          }
        } catch (e) {
          console.error('CSV解析失败，尝试其他格式', e);
        }
      }
      
      // 尝试逐行解析OTP URI
      if (content.includes('otpauth://')) {
        const lines = content.split(/\r?\n/).filter(line => line.trim() !== "");
        for (const line of lines) {
          if (line.startsWith('otpauth://')) {
            const entry = parseOtpUri(line);
            if (entry) {
              entries.push(entry);
            }
          }
        }
        
        if (entries.length > 0) {
          return entries;
        }
      }
      
      // 单个OTP URI
      if (content.trim().startsWith('otpauth://')) {
        const entry = parseOtpUri(content.trim());
        if (entry) {
          entries.push(entry);
          return entries;
        }
      }
      
      return entries;
    } catch (error) {
      console.error('解析导入内容时发生错误:', error);
      return [];
    }
  };

  // 处理从剪贴板导入
  const handleClipboardImport = async () => {
    if (!clipboardImportContent.trim()) return;
    
    try {
      setIsImporting(true);
      setError(null);
      
      // 解析导入内容
      const importedEntries = parseImportContent(clipboardImportContent);
      
      if (importedEntries.length === 0) {
        toast({
          title: "导入失败",
          description: "无法从提供的内容中解析出有效的令牌数据",
          variant: "destructive",
        });
        return;
      }
      
      // 转换为AuthenticatorToken格式
      const tokensToImport: AuthenticatorToken[] = importedEntries.map(entry => ({
        name: entry.name,
        secret: entry.secret,
        issuer: entry.issuer,
        type: entry.type || "totp",
        algorithm: entry.algorithm || "SHA1",
        digits: entry.digits || 6,
        period: entry.period || 30
      }));
      
      // 检查是否有重复并导入
      const result = await checkAndImportAuthenticatorTokens(tokensToImport);
      
      if (result.success) {
        // 如果有重复项，显示处理对话框
        if (result.duplicates && result.duplicates.length > 0) {
          setImportResult({
            newTokens: importedEntries,
            duplicates: result.duplicates,
            selected: []
          });
          setShowImportDialog(true);
        } else {
          // 没有重复项，导入成功
          toast({
            title: "导入成功",
            description: `已成功导入 ${result.inserted?.length || 0} 个令牌`,
          });
          // 清空导入内容
          setClipboardImportContent("");
        }
      } else {
        toast({
          title: "导入失败",
          description: (result as { error: string }).error || "导入令牌时发生错误",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('剪贴板导入时发生错误:', error);
      toast({
        title: "导入失败",
        description: "导入过程中发生错误",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  // 处理文件导入
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setIsImporting(true);
        const content = event.target?.result as string;
        
        // 解析导入内容
        const importedEntries = parseImportContent(content);
        
        if (importedEntries.length === 0) {
          toast({
            title: "导入失败",
            description: "无法从文件中解析出有效的令牌数据",
            variant: "destructive",
          });
          return;
        }
        
        // 转换为AuthenticatorToken格式
        const tokensToImport: AuthenticatorToken[] = importedEntries.map(entry => ({
          name: entry.name,
          secret: entry.secret,
          issuer: entry.issuer,
          type: entry.type || "totp",
          algorithm: entry.algorithm || "SHA1",
          digits: entry.digits || 6,
          period: entry.period || 30
        }));
        
        // 检查是否有重复并导入
        const result = await checkAndImportAuthenticatorTokens(tokensToImport);
        
        if (result.success) {
          // 如果有重复项，显示处理对话框
          if (result.duplicates && result.duplicates.length > 0) {
            setImportResult({
              newTokens: importedEntries,
              duplicates: result.duplicates,
              selected: []
            });
            setShowImportDialog(true);
          } else {
            // 没有重复项，导入成功
            toast({
              title: "导入成功",
              description: `已成功导入 ${result.inserted?.length || 0} 个令牌`,
            });
            // 清空文件输入
            if (importFileInputRef) {
              importFileInputRef.value = "";
            }
          }
        } else {
          toast({
            title: "导入失败",
            description: (result as { error: string }).error || "导入令牌时发生错误",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('文件导入时发生错误:', error);
        toast({
          title: "导入失败",
          description: "导入过程中发生错误",
          variant: "destructive",
        });
      } finally {
        setIsImporting(false);
      }
    };
    
    reader.readAsText(file);
  };

  // 处理导出令牌选择
  const getTokensForExport = (range: string): AuthenticatorEntry[] => {
    if (parsedEntries.length === 0) return [];
    
    switch (range) {
      case "current":
        return [parsedEntries[currentIndex]];
      case "selected":
        // 这里应该根据实际需求实现，例如通过多选框选择多个令牌
        // 目前简化为返回当前令牌
        return [parsedEntries[currentIndex]];
      case "all":
        return parsedEntries;
      default:
        return [parsedEntries[currentIndex]];
    }
  };

  // 格式化令牌为导出格式
  const formatTokensForExport = (tokens: AuthenticatorEntry[], format: string): string => {
    switch (format) {
      case "json":
        return JSON.stringify(tokens, null, 2);
      case "csv":
        // 基础CSV格式: name,secret,issuer
        const header = "name,secret,issuer";
        const rows = tokens.map(token => 
          `${token.name},${token.secret},${token.issuer || ""}`
        );
        return [header, ...rows].join("\n");
      case "uri":
        // 每行一个OTP URI
        return tokens.map(token => {
          // 生成otpauth URI
          let uri = `otpauth://${token.type || 'totp'}/`;
          
          if (token.issuer) {
            uri += `${encodeURIComponent(token.issuer)}:`;
          }
          
          uri += `${encodeURIComponent(token.name)}?secret=${token.secret}`;
          
          if (token.issuer) {
            uri += `&issuer=${encodeURIComponent(token.issuer)}`;
          }
          
          if (token.algorithm) {
            uri += `&algorithm=${token.algorithm}`;
          }
          
          if (token.digits) {
            uri += `&digits=${token.digits}`;
          }
          
          if (token.period) {
            uri += `&period=${token.period}`;
          }
          
          return uri;
        }).join("\n");
      default:
        return JSON.stringify(tokens, null, 2);
    }
  };

  // 处理剪贴板导出
  const handleClipboardExport = async () => {
    try {
      setIsExporting(true);
      
      // 获取要导出的令牌
      const tokensToExport = getTokensForExport(exportRange);
      
      if (tokensToExport.length === 0) {
        toast({
          title: "导出失败",
          description: "没有可导出的令牌",
          variant: "destructive",
        });
        return;
      }
      
      // 格式化数据
      const exportData = formatTokensForExport(tokensToExport, exportFormat);
      
      // 复制到剪贴板
      await navigator.clipboard.writeText(exportData);
      
      toast({
        title: "导出成功",
        description: `已成功将 ${tokensToExport.length} 个令牌复制到剪贴板`,
      });
    } catch (error) {
      console.error('复制到剪贴板时发生错误:', error);
      toast({
        title: "导出失败",
        description: "复制到剪贴板时发生错误",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // 处理文件导出
  const handleFileExport = () => {
    try {
      setIsExporting(true);
      
      // 获取要导出的令牌
      const tokensToExport = getTokensForExport(fileExportRange);
      
      if (tokensToExport.length === 0) {
        toast({
          title: "导出失败",
          description: "没有可导出的令牌",
          variant: "destructive",
        });
        return;
      }
      
      // 格式化数据
      const exportData = formatTokensForExport(tokensToExport, fileExportFormat);
      
      // 创建下载链接
      const blob = new Blob([exportData], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      
      // 设置文件名和扩展名
      let fileExtension = ".txt";
      switch (fileExportFormat) {
        case "json":
          fileExtension = ".json";
          break;
        case "csv":
          fileExtension = ".csv";
          break;
        default:
          fileExtension = ".txt";
      }
      
      // 如果只导出当前令牌，使用令牌名称作为文件名
      let fileName = "authenticator_tokens";
      if (fileExportRange === "current" && tokensToExport.length === 1) {
        fileName = tokensToExport[0].name.replace(/[^\w\s]/gi, '_');
      }
      
      downloadLink.download = `${fileName}${fileExtension}`;
      downloadLink.href = url;
      downloadLink.click();
      
      // 释放URL对象
      URL.revokeObjectURL(url);
      
      toast({
        title: "导出成功",
        description: `已成功导出 ${tokensToExport.length} 个令牌到文件`,
      });
    } catch (error) {
      console.error('导出文件时发生错误:', error);
      toast({
        title: "导出失败",
        description: "导出文件时发生错误",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // 处理重复项的更新
  const handleUpdateDuplicates = async () => {
    if (!importResult || selectedTokensToImport.length === 0) return;
    
    try {
      setIsImporting(true);
      
      // 准备要更新的重复项
      const duplicatesToUpdate = selectedTokensToImport.map(id => {
        const duplicate = importResult.duplicates.find(d => d.existing.id === id);
        if (!duplicate) return null;
        
        return {
          existingId: id,
          token: duplicate.new
        };
      }).filter(Boolean) as { existingId: string, token: AuthenticatorToken }[];
      
      if (duplicatesToUpdate.length === 0) return;
      
      // 调用API更新重复项
      const result = await updateDuplicateAuthenticatorTokens(duplicatesToUpdate);
      
      if (result.success) {
        toast({
          title: "更新成功",
          description: `已成功更新 ${result.updated?.length || 0} 个令牌`,
        });
        
        // 关闭对话框并清空状态
        setShowImportDialog(false);
        setImportResult(null);
        setSelectedTokensToImport([]);
      } else {
        toast({
          title: "更新失败",
          description: (result as { error: string }).error || "更新令牌时发生错误",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('更新重复令牌时发生错误:', error);
      toast({
        title: "更新失败",
        description: "更新过程中发生错误",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  // 切换选择重复项
  const toggleDuplicateSelection = (id: string) => {
    setSelectedTokensToImport(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // 选择全部重复项
  const selectAllDuplicates = () => {
    if (!importResult) return;
    setSelectedTokensToImport(importResult.duplicates.map(d => d.existing.id!));
  };

  // 取消选择全部重复项
  const deselectAllDuplicates = () => {
    setSelectedTokensToImport([]);
  };

  // 关闭导入对话框
  const handleCloseImportDialog = () => {
    setShowImportDialog(false);
    setImportResult(null);
    setSelectedTokensToImport([]);
  };

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
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="upload">上传CSV</TabsTrigger>
              <TabsTrigger value="qrcodes" disabled={parsedEntries.length === 0}>
                QR码 ({parsedEntries.length})
              </TabsTrigger>
              <TabsTrigger value="import-export">导入/导出</TabsTrigger>
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

                    {qrCodeUri && (
                      <div className="relative p-2 bg-white rounded-lg">
                        <QRCodeSVG
                          id="qr-code-svg"
                          value={qrCodeUri}
                          size={250}
                          level="M"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-full"
                          onClick={handleDownloadQR}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          下载QR码
                        </Button>
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

            <TabsContent value="import-export">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 剪贴板导入部分 */}
                  <div className="space-y-3 border rounded-lg p-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Clipboard className="mr-2 h-5 w-5" />
                      剪贴板导入
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      从剪贴板导入认证令牌数据，支持JSON、CSV和OTP Auth URI格式
                    </p>
                    <Textarea
                      placeholder="粘贴认证令牌数据..."
                      className="min-h-[120px]"
                      value={clipboardImportContent}
                      onChange={handleClipboardImportChange}
                    />
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleClearClipboardImport}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        清除
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleClipboardImport}
                        disabled={isImporting || !clipboardImportContent.trim()}
                      >
                        {isImporting ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            导入中...
                          </>
                        ) : (
                          <>
                            <Import className="mr-2 h-4 w-4" />
                            导入数据
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* 文件导入部分 */}
                  <div className="space-y-3 border rounded-lg p-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <FileUp className="mr-2 h-5 w-5" />
                      文件导入
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      从文件导入认证令牌数据，支持.json、.csv和.txt格式
                    </p>
                    <div className="grid w-full items-center gap-1.5">
                      <Input
                        id="import-file"
                        type="file"
                        accept=".json,.csv,.txt"
                        onChange={handleFileImport}
                        ref={(el) => setImportFileInputRef(el)}
                        disabled={isImporting}
                      />
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => document.getElementById('import-file')?.click()}
                      disabled={isImporting}
                    >
                      {isImporting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          导入中...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          上传并导入
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 剪贴板导出部分 */}
                  <div className="space-y-3 border rounded-lg p-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <ClipboardCopy className="mr-2 h-5 w-5" />
                      剪贴板导出
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      将令牌信息导出到剪贴板，可选择格式和导出范围
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="export-format">导出格式</Label>
                        <select 
                          id="export-format" 
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                          value={exportFormat}
                          onChange={(e) => setExportFormat(e.target.value)}
                        >
                          <option value="json">JSON (完整)</option>
                          <option value="csv">CSV (基础)</option>
                          <option value="uri">OTP URI (兼容)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="export-range">导出范围</Label>
                        <select 
                          id="export-range" 
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                          value={exportRange}
                          onChange={(e) => setExportRange(e.target.value)}
                        >
                          <option value="current">当前令牌</option>
                          <option value="selected">选中令牌</option>
                          <option value="all">全部令牌</option>
                        </select>
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={handleClipboardExport}
                      disabled={isExporting || parsedEntries.length === 0}
                    >
                      {isExporting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          导出中...
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          复制到剪贴板
                        </>
                      )}
                    </Button>
                  </div>

                  {/* 文件导出部分 */}
                  <div className="space-y-3 border rounded-lg p-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <FileDown className="mr-2 h-5 w-5" />
                      文件导出
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      将令牌信息导出到文件，可选择格式和导出范围
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="file-export-format">导出格式</Label>
                        <select 
                          id="file-export-format" 
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                          value={fileExportFormat}
                          onChange={(e) => setFileExportFormat(e.target.value)}
                        >
                          <option value="json">JSON 文件</option>
                          <option value="csv">CSV 文件</option>
                          <option value="txt">TXT 文件</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="file-export-range">导出范围</Label>
                        <select 
                          id="file-export-range" 
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                          value={fileExportRange}
                          onChange={(e) => setFileExportRange(e.target.value)}
                        >
                          <option value="current">当前令牌</option>
                          <option value="selected">选中令牌</option>
                          <option value="all">全部令牌</option>
                        </select>
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={handleFileExport}
                      disabled={isExporting || parsedEntries.length === 0}
                    >
                      {isExporting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          导出中...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          下载文件
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <Alert>
                  <AlertOctagon className="h-4 w-4" />
                  <AlertTitle>导入注意事项</AlertTitle>
                  <AlertDescription>
                    导入时会检查令牌是否已存在。如果发现重复项，系统会提示您选择更新现有记录或创建新记录。
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-xs text-muted-foreground">
            Authenticator兼容于Google Authenticator、Microsoft Authenticator和其他TOTP应用
          </p>
        </CardFooter>
      </Card>

      {/* 导入重复项处理对话框 */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>处理重复的令牌</DialogTitle>
            <DialogDescription>
              发现以下令牌已存在，请选择需要更新的项目。未选择的项目将保持不变。
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-between mb-2">
              <Button variant="outline" size="sm" onClick={selectAllDuplicates}>
                全选
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAllDuplicates}>
                取消全选
              </Button>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto border rounded-md">
              {importResult?.duplicates.map((item, index) => (
                <div
                  key={item.existing.id}
                  className={`flex items-center justify-between p-3 ${
                    index !== importResult.duplicates.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`token-${item.existing.id}`}
                      checked={selectedTokensToImport.includes(item.existing.id!)}
                      onCheckedChange={() => toggleDuplicateSelection(item.existing.id!)}
                    />
                    <div>
                      <label
                        htmlFor={`token-${item.existing.id}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {item.existing.name}
                      </label>
                      {item.existing.issuer && (
                        <p className="text-xs text-muted-foreground">
                          {item.existing.issuer}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseImportDialog}>
              取消
            </Button>
            <Button
              onClick={handleUpdateDuplicates}
              disabled={selectedTokensToImport.length === 0}
            >
              更新选中项
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
