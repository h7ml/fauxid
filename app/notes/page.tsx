"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { NoteType, searchNotes } from "@/app/actions/note-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NoteCard from "@/components/ui/note-card";
import NoteTable from "@/components/ui/note-table";
import NoteForm from "@/components/ui/note-form";
import NoteImportExport from "@/components/ui/note-import-export";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, Search, Download, Upload, LayoutGrid, List, LayoutList, Star, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<NoteType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("table");
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<NoteType | undefined>(undefined);
  const { toast } = useToast();
  const supabase = createClient();

  // 加载笔记数据
  const loadNotes = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) {
        throw error;
      }

      setNotes(data || []);

      // 应用过滤器和搜索
      applyFiltersAndSearch(data || [], filter, searchQuery);
    } catch (error) {
      console.error("加载笔记出错:", error);
      toast({
        title: "数据加载失败",
        description: "无法加载笔记数据，请刷新页面重试",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadNotes();

    // 设置实时订阅
    const subscription = supabase
      .channel("notes_changes")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "notes"
      }, () => {
        // 当发生变化时重新加载
        loadNotes();
      })
      .subscribe();

    return () => {
      // 组件卸载时取消订阅
      supabase.removeChannel(subscription);
    };
  }, []);

  // 应用过滤器和搜索
  const applyFiltersAndSearch = (notesList: NoteType[], filterType: string, query: string) => {
    // 首先应用过滤器
    let filtered = notesList;

    if (filterType === "favorites") {
      filtered = notesList.filter(note => note.is_favorite);
    }

    // 然后应用搜索
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(note =>
        (note.title && note.title.toLowerCase().includes(lowerQuery)) ||
        (note.site_url && note.site_url.toLowerCase().includes(lowerQuery)) ||
        (note.username && note.username.toLowerCase().includes(lowerQuery)) ||
        (note.notes && note.notes.toLowerCase().includes(lowerQuery)) ||
        (note.tags && note.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
      );
    }

    setFilteredNotes(filtered);
  };

  // 处理搜索
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      // 如果搜索框为空，显示所有笔记（带过滤器）
      applyFiltersAndSearch(notes, filter, "");
      return;
    }

    setIsLoading(true);

    try {
      // 如果是服务器端搜索
      if (searchQuery.trim().length >= 3) {
        const result = await searchNotes(searchQuery);

        if (result.success && result.data) {
          // 应用过滤器到搜索结果
          applyFiltersAndSearch(result.data, filter, searchQuery);
        } else {
          toast({
            title: "搜索失败",
            description: result.error || "无法执行搜索，请稍后重试",
            variant: "destructive"
          });
        }
      } else {
        // 客户端搜索
        applyFiltersAndSearch(notes, filter, searchQuery);
      }
    } catch (error) {
      console.error("搜索出错:", error);
      toast({
        title: "搜索失败",
        description: "执行搜索时出现错误",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 过滤器变化
  useEffect(() => {
    applyFiltersAndSearch(notes, filter, searchQuery);
  }, [filter, notes]);

  // 处理笔记编辑
  const handleEditNote = (note: NoteType) => {
    setCurrentNote(note);
    setIsNoteFormOpen(true);
  };

  // 处理笔记删除（从UI中移除）
  const handleNoteDeleted = (id?: string) => {
    if (id) {
      setNotes(prev => prev.filter(note => note.id !== id));
    }
  };

  return (
    <div className="container py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">密码管理器</h1>
          <p className="text-muted-foreground">
            管理您的网站账号、密码和认证信息
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setCurrentNote(undefined);
              setIsNoteFormOpen(true);
            }}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            添加笔记
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsImportExportOpen(true)}
          >
            <Download className="h-4 w-4 mr-2" />
            导入/导出
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索笔记..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">搜索</Button>
        </form>

        <div className="flex gap-2 items-center">
          <Select
            value={filter}
            onValueChange={(value: "all" | "favorites") => setFilter(value)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="全部笔记" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部笔记</SelectItem>
              <SelectItem value="favorites">
                <div className="flex items-center">
                  <Star className="mr-2 h-4 w-4 text-amber-500" />
                  <span>收藏</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="border rounded-md p-1">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("table")}
              className="h-8 w-8"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "card" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("card")}
              className="h-8 w-8"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 统计指标和提示 */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <Badge variant="outline" className="py-1.5">
          <FileText className="mr-1 h-4 w-4" />
          共 {notes.length} 条笔记
        </Badge>
        {filter === "favorites" && (
          <Badge variant="secondary" className="py-1.5">
            <Star className="mr-1 h-4 w-4 text-amber-500" />
            {filteredNotes.length} 条收藏笔记
          </Badge>
        )}
        {searchQuery && (
          <Badge variant="secondary" className="py-1.5">
            <Search className="mr-1 h-4 w-4" />
            找到 {filteredNotes.length} 条匹配笔记
          </Badge>
        )}
      </div>

      {/* 笔记内容 */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">加载笔记中...</p>
          </div>
        </div>
      ) : viewMode === "table" ? (
        <NoteTable
          notes={filteredNotes}
          onEdit={handleEditNote}
          onDelete={handleNoteDeleted}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={() => handleNoteDeleted(note.id)}
            />
          ))}
          {filteredNotes.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg">暂无笔记</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery
                  ? "没有找到匹配的笔记，请尝试其他搜索词"
                  : filter === "favorites"
                    ? "您还没有收藏任何笔记"
                    : "点击'添加笔记'按钮开始创建"}
              </p>
              <Button
                className="mt-4"
                onClick={() => {
                  setCurrentNote(undefined);
                  setIsNoteFormOpen(true);
                }}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                添加笔记
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 笔记表单对话框 */}
      <NoteForm
        isOpen={isNoteFormOpen}
        onClose={() => setIsNoteFormOpen(false)}
        note={currentNote}
        onSuccess={loadNotes}
      />

      {/* 导入/导出对话框 */}
      <NoteImportExport
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        onSuccess={loadNotes}
      />
    </div>
  );
}
