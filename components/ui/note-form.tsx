"use client";

import { useState, useEffect } from "react";
import { NoteType } from "@/app/actions/note-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { createNote, updateNote } from "@/app/actions/note-actions";
import { FileText, Globe, Lock, Key, Tag, X, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  note?: NoteType;
  onSuccess?: () => void;
}

export default function NoteForm({ isOpen, onClose, note, onSuccess }: NoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState("basic");
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState<Omit<NoteType, "id">>({
    site_url: "",
    title: "",
    username: "",
    password: "",
    notes: "",
    token: "",
    cookie: "",
    tags: []
  });
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  // 表单重置
  const resetForm = () => {
    setFormData({
      site_url: "",
      title: "",
      username: "",
      password: "",
      notes: "",
      token: "",
      cookie: "",
      tags: []
    });
    setTagInput("");
    setCurrentTab("basic");
  };

  // 加载编辑数据
  useEffect(() => {
    if (note) {
      setFormData({
        site_url: note.site_url || "",
        title: note.title || "",
        username: note.username || "",
        password: note.password || "",
        notes: note.notes || "",
        token: note.token || "",
        cookie: note.cookie || "",
        tags: note.tags || []
      });
    } else {
      resetForm();
    }
  }, [note, isOpen]);

  // 处理表单字段变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 添加标签
  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  // 删除标签
  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag)
    }));
  };

  // 处理标签输入键盘事件
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.site_url || !formData.title) {
      toast({
        title: "请填写必填字段",
        description: "网址和标题为必填字段",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSubmit = new FormData();

      if (note?.id) {
        formDataToSubmit.append("id", note.id);
      }

      // 添加表单数据
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "tags") {
          // 标签特殊处理
          formDataToSubmit.append(key, (value as string[]).join(","));
        } else if (value !== undefined && value !== null) {
          formDataToSubmit.append(key, value.toString());
        }
      });

      // 创建或更新笔记
      const result = note?.id
        ? await updateNote(formDataToSubmit)
        : await createNote(formDataToSubmit);

      if (result.success) {
        toast({
          title: note?.id ? "笔记已更新" : "笔记已创建",
          duration: 2000
        });

        resetForm();
        onClose();

        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast({
          title: "操作失败",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "操作失败",
        description: "发生错误，请稍后重试",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{note?.id ? "编辑笔记" : "添加笔记"}</DialogTitle>
          <DialogDescription>
            {note?.id
              ? "更新您的账号密码和认证信息"
              : "添加新的网站账号密码或认证信息"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">基本信息</TabsTrigger>
              <TabsTrigger value="auth">认证信息</TabsTrigger>
              <TabsTrigger value="extra">附加信息</TabsTrigger>
            </TabsList>

            {/* 基本信息标签页 */}
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="site_url">
                  网址 <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="site_url"
                    name="site_url"
                    placeholder="网站URL"
                    value={formData.site_url}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">
                  标题 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="用于识别的标题"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">用户名/账号</Label>
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    name="username"
                    placeholder="登录账号"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative flex items-center">
                  <Key className="h-4 w-4 text-muted-foreground absolute left-2" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="登录密码"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-8 pr-8"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* 认证信息标签页 */}
            <TabsContent value="auth" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="token">令牌 (Token)</Label>
                <Textarea
                  id="token"
                  name="token"
                  placeholder="API令牌、JWT等"
                  value={formData.token}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cookie">Cookie</Label>
                <Textarea
                  id="cookie"
                  name="cookie"
                  placeholder="会话Cookie信息"
                  value={formData.cookie}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </TabsContent>

            {/* 附加信息标签页 */}
            <TabsContent value="extra" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="notes">备注</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="额外信息或备注"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">标签</Label>
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="tags"
                    placeholder="添加标签，按Enter键确认"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTag}
                  >
                    添加
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "保存中..." : note?.id ? "更新" : "保存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
