"use client";

import { useState, useRef } from "react";
import { NoteType, exportNotes, importNotes } from "@/app/actions/note-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Import, Download, Upload, AlertCircle, Save, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface NoteImportExportProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function NoteImportExport({ isOpen, onClose, onSuccess }: NoteImportExportProps) {
  const [currentTab, setCurrentTab] = useState("export");
  const [exportedData, setExportedData] = useState("");
  const [importData, setImportData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // 处理导出
  const handleExport = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const result = await exportNotes();

      if (result.success && result.data) {
        const dataStr = JSON.stringify(result.data, null, 2);
        setExportedData(dataStr);
        setResult({
          success: true,
          message: `成功导出 ${result.data.length} 条笔记`
        });
      } else {
        setResult({
          success: false,
          message: result.error || "导出失败"
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "导出过程中出现错误"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 下载导出的数据
  const downloadExportedData = () => {
    if (!exportedData) return;

    const blob = new Blob([exportedData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notes_export_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "笔记已下载",
      description: "笔记数据已保存到您的设备",
      duration: 3000
    });
  };

  // 复制导出的数据到剪贴板
  const copyExportedData = async () => {
    if (!exportedData) return;

    try {
      await navigator.clipboard.writeText(exportedData);
      toast({
        title: "已复制到剪贴板",
        duration: 2000
      });
    } catch (err) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive"
      });
    }
  };

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setImportData(content);
      } catch (error) {
        toast({
          title: "文件读取失败",
          description: "请确保选择了有效的JSON文件",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  // 处理导入
  const handleImport = async () => {
    if (!importData) {
      toast({
        title: "请提供导入数据",
        description: "请输入JSON格式的笔记数据或选择文件",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setResult(null);

    try {
      // 尝试解析JSON
      const parsedData = JSON.parse(importData);

      if (!Array.isArray(parsedData)) {
        throw new Error("导入数据必须是数组格式");
      }

      // 验证数据格式
      const validNotes = parsedData.filter((item: any) =>
        typeof item === "object" && item.site_url && item.title
      );

      if (validNotes.length === 0) {
        throw new Error("未找到有效的笔记数据");
      }

      // 开始导入动画
      const animateProgress = () => {
        setProgress(prev => {
          const next = prev + 5;
          return next < 90 ? next : prev;
        });
      };

      const progressInterval = setInterval(animateProgress, 100);

      // 执行导入
      const result = await importNotes(validNotes);

      clearInterval(progressInterval);
      setProgress(100);

      if (result.success) {
        setResult({
          success: true,
          message: `成功导入 ${validNotes.length} 条笔记`
        });

        // 导入成功后清空文本框
        setImportData("");

        if (onSuccess) {
          onSuccess();
        }
      } else {
        setResult({
          success: false,
          message: result.error || "导入失败"
        });
      }
    } catch (error) {
      setProgress(0);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "导入过程中出现错误"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>导入/导出笔记</DialogTitle>
          <DialogDescription>
            导出您的笔记数据或从文件导入笔记
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">导出</TabsTrigger>
            <TabsTrigger value="import">导入</TabsTrigger>
          </TabsList>

          {/* 导出标签页 */}
          <TabsContent value="export" className="space-y-4 pt-4">
            <div className="flex justify-center mb-4">
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={isLoading}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                {isLoading ? "导出中..." : "导出所有笔记"}
              </Button>
            </div>

            {exportedData && (
              <>
                <Textarea
                  value={exportedData}
                  readOnly
                  className="h-[200px] font-mono text-xs"
                />

                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    onClick={copyExportedData}
                    className="flex-1"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    复制到剪贴板
                  </Button>
                  <Button
                    variant="default"
                    onClick={downloadExportedData}
                    className="flex-1"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    下载文件
                  </Button>
                </div>
              </>
            )}

            {result && (
              <Alert variant={result.success ? "default" : "destructive"}>
                {result.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>{result.success ? "成功" : "错误"}</AlertTitle>
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* 导入标签页 */}
          <TabsContent value="import" className="space-y-4 pt-4">
            <div className="flex justify-center mb-4">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Import className="mr-2 h-4 w-4" />
                选择JSON文件
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <Textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="粘贴JSON格式的笔记数据..."
              className="h-[200px] font-mono text-xs"
              disabled={isLoading}
            />

            {isLoading && (
              <div className="space-y-2">
                <div className="text-sm text-center text-muted-foreground">
                  正在导入数据...
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {result && (
              <Alert variant={result.success ? "default" : "destructive"}>
                {result.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>{result.success ? "成功" : "错误"}</AlertTitle>
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleImport}
              disabled={isLoading || !importData}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isLoading ? "导入中..." : "开始导入"}
            </Button>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
