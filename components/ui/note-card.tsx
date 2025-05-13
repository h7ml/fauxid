"use client";

import { useState } from "react";
import { NoteType } from "@/app/actions/note-actions";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toggleFavorite, deleteNote, updateLastUsed } from "@/app/actions/note-actions";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Eye, Star, StarOff, Copy, Trash2, Globe, Lock, Key, FileText, Calendar, Clock, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

// 安全复制到剪贴板的函数
async function safeCopyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    // 安全上下文中使用现代API
    await navigator.clipboard.writeText(text);
    return true;
  } else {
    // 兼容方式
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand("copy");
    textArea.remove();
    return success;
  }
}

interface NoteCardProps {
  note: NoteType;
  onEdit: (note: NoteType) => void;
  onDelete?: () => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const [isFavorite, setIsFavorite] = useState(note.is_favorite || false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  // 处理收藏切换
  async function handleToggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData();
    formData.append("id", note.id || "");
    formData.append("is_favorite", isFavorite ? "true" : "false");

    const result = await toggleFavorite(formData);

    if (result.success) {
      setIsFavorite(!isFavorite);
      toast({
        title: !isFavorite ? "已添加到收藏" : "已从收藏中移除",
        duration: 2000
      });
    } else {
      toast({
        title: "操作失败",
        description: result.error,
        variant: "destructive"
      });
    }
  }

  // 处理删除
  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (confirm("确定要删除这条笔记吗？")) {
      const formData = new FormData();
      formData.append("id", note.id || "");

      const result = await deleteNote(formData);

      if (result.success) {
        toast({
          title: "笔记已删除",
          duration: 2000
        });

        if (onDelete) {
          onDelete();
        }
      } else {
        toast({
          title: "删除失败",
          description: result.error,
          variant: "destructive"
        });
      }
    }
  }

  // 复制到剪贴板
  async function copyToClipboard(text: string, fieldName: string) {
    try {
      await safeCopyToClipboard(text);

      // 如果有ID，更新最后使用时间
      if (note.id) {
        await updateLastUsed(note.id);
      }

      toast({
        title: `${fieldName}已复制到剪贴板`,
        duration: 2000
      });
    } catch (err) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive"
      });
    }
  }

  // 格式化日期显示
  function formatDate(dateString?: string) {
    if (!dateString) return "未知";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: zhCN });
    } catch (e) {
      return "日期无效";
    }
  }

  return (
    <Card
      className={cn(
        "w-full overflow-hidden transition-all duration-300 h-full flex flex-col cursor-pointer",
        isFavorite ? "border-amber-400 shadow-md" : "border",
        isHovered ? "translate-y-[-4px] shadow-lg" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdit(note)}
    >
      {/* 收藏标记 */}
      {isFavorite && (
        <div className="absolute top-0 right-0 z-10 w-16 h-16 overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-br from-amber-300 to-amber-500 w-20 h-20 -rotate-45 transform origin-top-right"></div>
          <Star className="absolute top-3 right-3 h-4 w-4 text-white" />
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-medium line-clamp-1" title={note.title}>
            {note.title}
          </CardTitle>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
          <Globe className="h-3.5 w-3.5" />
          <span className="line-clamp-1" title={note.site_url}>{note.site_url}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-grow pb-2">
        {/* 用户名密码信息 */}
        {note.username && (
          <div className="mb-2 text-sm flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="line-clamp-1">{note.username}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(note.username || "", "用户名");
              }}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {note.password && (
          <div className="mb-2 text-sm flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Key className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="line-clamp-1">••••••••</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(note.password || "", "密码");
              }}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {/* 其他属性只显示是否存在 */}
        <div className="flex gap-2 flex-wrap mt-3">
          {note.notes && (
            <Badge variant="outline" className="px-2 py-0 h-5 text-xs">
              <FileText className="h-3 w-3 mr-1" /> 备注
            </Badge>
          )}
          {note.token && (
            <Badge variant="outline" className="px-2 py-0 h-5 text-xs">
              <Key className="h-3 w-3 mr-1" /> Token
            </Badge>
          )}
          {note.cookie && (
            <Badge variant="outline" className="px-2 py-0 h-5 text-xs">
              <FileText className="h-3 w-3 mr-1" /> Cookie
            </Badge>
          )}
        </div>

        {/* 标签 */}
        {note.tags && note.tags.length > 0 && (
          <div className="mt-2 flex gap-1 flex-wrap">
            {note.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary" className="px-2 py-0 h-5 text-xs">
                <Tag className="h-3 w-3 mr-1" /> {tag}
              </Badge>
            ))}
            {note.tags.length > 3 && (
              <Badge variant="secondary" className="px-2 py-0 h-5 text-xs">
                +{note.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center text-xs text-muted-foreground border-t p-2">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span title={`创建: ${note.created_at}`}>
            {formatDate(note.created_at)}
          </span>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleToggleFavorite}
            title={isFavorite ? "取消收藏" : "收藏"}
          >
            {isFavorite ? (
              <StarOff className="h-3.5 w-3.5" />
            ) : (
              <Star className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive"
            onClick={handleDelete}
            title="删除"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 
