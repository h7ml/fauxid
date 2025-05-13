"use client";

import { useState } from "react";
import { NoteType } from "@/app/actions/note-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toggleFavorite, deleteNote, updateLastUsed } from "@/app/actions/note-actions";
import { useToast } from "@/components/ui/use-toast";
import {
  Eye, Star, StarOff, Copy, Trash2, Globe,
  Lock, Key, FileText, Calendar, ArrowUp, ArrowDown, Tag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

interface NoteTableProps {
  notes: NoteType[];
  onEdit: (note: NoteType) => void;
  onDelete?: (id: string) => void;
}

export default function NoteTable({ notes, onEdit, onDelete }: NoteTableProps) {
  const [sortField, setSortField] = useState<keyof NoteType>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();

  // 切换排序
  const toggleSort = (field: keyof NoteType) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // 排序笔记
  const sortedNotes = [...notes].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      if (sortDirection === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    }

    if (aValue instanceof Array && bValue instanceof Array) {
      if (sortDirection === "asc") {
        return aValue.length - bValue.length;
      } else {
        return bValue.length - aValue.length;
      }
    }

    if (sortDirection === "asc") {
      return String(aValue).localeCompare(String(bValue));
    } else {
      return String(bValue).localeCompare(String(aValue));
    }
  });

  // 处理收藏切换
  async function handleToggleFavorite(e: React.MouseEvent, note: NoteType) {
    e.stopPropagation();

    const formData = new FormData();
    formData.append("id", note.id || "");
    formData.append("is_favorite", note.is_favorite ? "true" : "false");

    const result = await toggleFavorite(formData);

    if (result.success) {
      toast({
        title: !note.is_favorite ? "已添加到收藏" : "已从收藏中移除",
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
  async function handleDelete(e: React.MouseEvent, note: NoteType) {
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

        if (onDelete && note.id) {
          onDelete(note.id);
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
  async function copyToClipboard(e: React.MouseEvent, text: string, fieldName: string, noteId?: string) {
    e.stopPropagation();

    try {
      await safeCopyToClipboard(text);

      // 如果有ID，更新最后使用时间
      if (noteId) {
        await updateLastUsed(noteId);
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

  // 排序图标
  function SortIcon({ field }: { field: keyof NoteType }) {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />;
  }

  return (
    <div className="w-full overflow-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="w-[250px] cursor-pointer"
              onClick={() => toggleSort("title")}
            >
              <div className="flex items-center">
                标题 <SortIcon field="title" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => toggleSort("site_url")}
            >
              <div className="flex items-center">
                网站 <SortIcon field="site_url" />
              </div>
            </TableHead>
            <TableHead>账号</TableHead>
            <TableHead>密码/令牌</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => toggleSort("updated_at")}
            >
              <div className="flex items-center">
                更新时间 <SortIcon field="updated_at" />
              </div>
            </TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedNotes.map((note) => (
            <TableRow
              key={note.id}
              className={cn(
                "cursor-pointer hover:bg-muted/50",
                note.is_favorite && "bg-amber-50 dark:bg-amber-950/20"
              )}
              onClick={() => onEdit(note)}
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-1">
                  {note.is_favorite && <Star className="h-4 w-4 text-amber-500" />}
                  <span className="line-clamp-1">{note.title}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="line-clamp-1">{note.site_url}</span>
                </div>
              </TableCell>
              <TableCell>
                {note.username ? (
                  <div className="flex items-center gap-1">
                    <span className="line-clamp-1">{note.username}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => copyToClipboard(e, note.username || "", "用户名", note.id)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>复制用户名</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">无</span>
                )}
              </TableCell>
              <TableCell>
                {note.password ? (
                  <div className="flex items-center gap-1">
                    <span className="line-clamp-1">••••••••</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => copyToClipboard(e, note.password || "", "密码", note.id)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>复制密码</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : note.token ? (
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="px-2 py-0 h-5 text-xs">
                      <Key className="h-3 w-3 mr-1" /> Token
                    </Badge>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => copyToClipboard(e, note.token || "", "Token", note.id)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>复制Token</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">无</span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(note.updated_at)}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => handleToggleFavorite(e, note)}
                        >
                          {note.is_favorite ? (
                            <StarOff className="h-3.5 w-3.5" />
                          ) : (
                            <Star className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{note.is_favorite ? "取消收藏" : "收藏"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={(e) => handleDelete(e, note)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>删除</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {notes.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <FileText className="h-8 w-8 mb-2" />
                  <p>暂无笔记</p>
                  <p className="text-sm">点击"添加笔记"按钮创建新的笔记</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
} 
