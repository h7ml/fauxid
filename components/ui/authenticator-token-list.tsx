"use client";

import { useState, useEffect, useMemo } from "react";
import { getUserAuthenticatorTokens, deleteAuthenticatorToken, toggleFavoriteToken, AuthenticatorToken } from "@/app/actions/authenticator-actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  QrCode, Star, Trash2, Search, AlertCircle, StarOff,
  Filter, Download, RefreshCw, DownloadCloud, Copy, Layers,
  AlertTriangle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Eraser, Trash
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// 分页设置
const PAGE_SIZES = [10, 25, 50, 100];
const DEFAULT_PAGE_SIZE = 25;

interface AuthenticatorTokenListProps {
  showControls?: boolean;
  hideHeader?: boolean;
}

export default function AuthenticatorTokenList({ showControls = true, hideHeader = false }: AuthenticatorTokenListProps) {
  const [tokens, setTokens] = useState<AuthenticatorToken[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterBy, setFilterBy] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("favorite");
  const [showDuplicates, setShowDuplicates] = useState<boolean>(false);

  // 分页状态
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  // 弹窗状态
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [deletingDuplicates, setDeletingDuplicates] = useState<boolean>(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [deletingAllTokens, setDeletingAllTokens] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchTokens();
  }, []);

  // 页面改变时重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterBy, showDuplicates]);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const response = await getUserAuthenticatorTokens();

      if (response.success) {
        setTokens(response.data || []);
        setError(null);
      } else {
        setError(response.error || "获取令牌失败");
        setTokens([]);
      }
    } catch (error) {
      console.error("获取令牌时发生错误:", error);
      setError("获取令牌时发生错误");
      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteAuthenticatorToken(id);

      if (response.success) {
        setTokens(tokens.filter(token => token.id !== id));
        toast({
          title: "删除成功",
          description: "已成功删除认证令牌",
        });
      } else {
        toast({
          title: "删除失败",
          description: response.error || "删除令牌时发生错误",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("删除令牌时发生错误:", error);
      toast({
        title: "删除失败",
        description: "删除令牌时发生未知错误",
        variant: "destructive",
      });
    }
  };

  // 删除所有令牌
  const handleDeleteAllTokens = async () => {
    if (tokens.length === 0) {
      toast({
        title: "没有需要删除的令牌",
        description: "令牌列表为空"
      });
      return;
    }

    try {
      setDeletingAllTokens(true);
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

      // 删除完成后刷新令牌列表
      await fetchTokens();

      if (successCount > 0) {
        toast({
          title: "批量删除完成",
          description: `成功删除 ${successCount} 个令牌${failCount > 0 ? `，${failCount} 个删除失败` : ''}`
        });
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
      setShowDeleteAllDialog(false);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      const response = await toggleFavoriteToken(id);

      if (response.success) {
        setTokens(
          tokens.map(token =>
            token.id === id ? { ...token, is_favorite: !token.is_favorite } : token
          )
        );
      } else {
        toast({
          title: "操作失败",
          description: response.error || "更新令牌时发生错误",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("更新令牌时发生错误:", error);
      toast({
        title: "操作失败",
        description: "更新令牌时发生未知错误",
        variant: "destructive",
      });
    }
  };

  const handleCopySuccess = () => {
    toast({
      title: "复制成功",
      description: "密钥已复制到剪贴板",
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (value: string) => {
    setFilterBy(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const toggleDuplicatesView = () => {
    setShowDuplicates(!showDuplicates);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1); // 重置到第一页
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 查找重复项
  const findDuplicateKeys = useMemo(() => {
    const duplicateSet = new Set<string>();
    // 使用复合键: name + issuer + secret
    const groupMap = new Map<string, AuthenticatorToken[]>();

    tokens.forEach(token => {
      // 创建复合键，确保三个字段都相同的令牌才被视为重复
      const compositeKey = `${token.name}__|${token.issuer || ""}__|${token.secret}`;

      if (!groupMap.has(compositeKey)) {
        groupMap.set(compositeKey, [token]);
      } else {
        groupMap.get(compositeKey)?.push(token);
        // 如果有重复，就将这个令牌的ID（如果有）添加到重复集合中
        if (token.id) {
          duplicateSet.add(token.id);
        }
        // 同时将相同组的所有令牌ID都添加到重复集合中
        groupMap.get(compositeKey)?.forEach(t => {
          if (t.id) duplicateSet.add(t.id);
        });
      }
    });

    return duplicateSet;
  }, [tokens]);

  // 找出需要删除的重复令牌
  const duplicatesToDelete = useMemo(() => {
    const result: string[] = [];
    // 使用复合键: name + issuer + secret
    const groupMap = new Map<string, AuthenticatorToken[]>();

    // 按复合键分组，只处理有ID的令牌
    tokens.forEach(token => {
      if (!token.id) return;

      // 创建复合键，确保三个字段都相同的令牌才被视为重复
      const compositeKey = `${token.name}__|${token.issuer || ""}__|${token.secret}`;

      if (!groupMap.has(compositeKey)) {
        groupMap.set(compositeKey, [token]);
      } else {
        groupMap.get(compositeKey)?.push(token);
      }
    });

    // 对于每组重复项，保留创建时间最新的（假设ID越大越新）
    groupMap.forEach((groupTokens, compositeKey) => {
      if (groupTokens.length <= 1) return;

      // 过滤出有ID的令牌并按ID降序排序（保留ID最大的）
      const tokensWithIds = groupTokens.filter(token => !!token.id);
      const sortedTokens = [...tokensWithIds].sort((a, b) => {
        // TypeScript类型断言，因为我们已经过滤掉了没有ID的令牌
        const idA = a.id as string;
        const idB = b.id as string;
        return idB.localeCompare(idA);
      });

      // 除了第一个（最新的）以外，都标记为删除
      for (let i = 1; i < sortedTokens.length; i++) {
        // 此处可以安全断言，因为我们已经过滤了没有ID的令牌
        result.push(sortedTokens[i].id as string);
      }
    });

    return result;
  }, [tokens]);

  // 删除所有重复项
  const handleDeleteDuplicates = async () => {
    if (duplicatesToDelete.length === 0) {
      toast({
        title: "没有需要删除的重复项",
        description: "未找到需要删除的重复令牌"
      });
      return;
    }

    try {
      setDeletingDuplicates(true);
      let successCount = 0;
      let failCount = 0;

      // 逐个删除重复项
      for (const id of duplicatesToDelete) {
        const response = await deleteAuthenticatorToken(id);
        if (response.success) {
          successCount++;
        } else {
          failCount++;
        }
      }

      // 删除完成后刷新令牌列表
      if (successCount > 0) {
        await fetchTokens();

        toast({
          title: "删除重复项完成",
          description: `成功删除 ${successCount} 个重复项${failCount > 0 ? `，${failCount} 个删除失败` : ''}`
        });
      } else {
        toast({
          title: "删除失败",
          description: "未能删除任何重复项",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("删除重复项时发生错误:", error);
      toast({
        title: "操作失败",
        description: "删除重复项时发生未知错误",
        variant: "destructive"
      });
    } finally {
      setDeletingDuplicates(false);
      setShowDeleteDialog(false);
    }
  };

  // 过滤和排序令牌
  const processedTokens = useMemo(() => {
    let result = [...tokens];

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(token =>
        token.name.toLowerCase().includes(query) ||
        (token.issuer && token.issuer.toLowerCase().includes(query)) ||
        token.secret.toLowerCase().includes(query)
      );
    }

    // 按类型过滤
    if (filterBy !== "all") {
      if (filterBy === "favorites") {
        result = result.filter(token => token.is_favorite);
      } else if (filterBy === "duplicates") {
        result = result.filter(token => token.id && findDuplicateKeys.has(token.id));
      }
    }

    // 显示/隐藏重复项
    if (showDuplicates) {
      // 当启用时，只显示重复项
      result = result.filter(token => token.id && findDuplicateKeys.has(token.id));
    }

    // 排序
    result.sort((a, b) => {
      switch (sortBy) {
        case "favorite":
          // 收藏优先，然后按名称
          if (a.is_favorite && !b.is_favorite) return -1;
          if (!a.is_favorite && b.is_favorite) return 1;
          return a.name.localeCompare(b.name);
        case "name":
          return a.name.localeCompare(b.name);
        case "issuer":
          const issuerA = a.issuer || "";
          const issuerB = b.issuer || "";
          return issuerA.localeCompare(issuerB);
        case "newest":
          // 假设id越大越新，这取决于数据库的id生成方式
          const idA = a.id ?? "";
          const idB = b.id ?? "";
          return idB.localeCompare(idA);
        default:
          return 0;
      }
    });

    return result;
  }, [tokens, searchQuery, filterBy, sortBy, showDuplicates, findDuplicateKeys]);

  // 分页数据
  const paginatedTokens = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedTokens.slice(startIndex, startIndex + pageSize);
  }, [processedTokens, currentPage, pageSize]);

  // 总页数
  const totalPages = Math.max(1, Math.ceil(processedTokens.length / pageSize));

  // 生成导出的CSV内容
  const generateCsvContent = () => {
    const header = "name,secret,issuer,type,algorithm,digits,period\n";
    const rows = processedTokens.map(token => {
      return `${token.name},${token.secret},${token.issuer || ""},${token.type || "totp"},${token.algorithm || "SHA1"},${token.digits || 6},${token.period || 30}`;
    }).join("\n");
    return header + rows;
  };

  // 导出为CSV文件
  const exportToCsv = () => {
    const csvContent = generateCsvContent();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `authenticator_tokens_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 生成页码列表
  const getPageNumbers = () => {
    const maxPageButtons = 5; // 最多显示5个页码按钮
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    // 调整确保显示maxPageButtons个按钮（如果可能）
    if (endPage - startPage + 1 < maxPageButtons && totalPages > maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  if (loading) {
    return (
      <Card className="relative overflow-hidden border border-border/40 shadow-md">
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm z-0"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2 text-xl">
            <QrCode className="h-5 w-5 text-cyber-blue" />
            认证令牌
          </CardTitle>
          <CardDescription>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full bg-cyber-blue/30 animate-pulse"></div>
              <span>加载中...</span>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error && tokens.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>加载失败</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="relative overflow-hidden border border-border/40 shadow-md">
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm z-0"></div>

      {!hideHeader && (
        <CardHeader className="relative z-10 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <QrCode className="h-5 w-5 text-cyber-blue" />
              认证令牌
              {findDuplicateKeys.size > 0 && (
                <Badge variant="outline" className="ml-2 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/20">
                  发现 {findDuplicateKeys.size} 个重复密钥
                </Badge>
              )}
            </CardTitle>
            {showControls && tokens.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">操作</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>数据操作</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={exportToCsv}>
                    <DownloadCloud className="mr-2 h-4 w-4" />
                    <span>导出为CSV</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleDuplicatesView}>
                    <Layers className="mr-2 h-4 w-4" />
                    <span>{showDuplicates ? "显示所有令牌" : "只显示重复令牌"}</span>
                  </DropdownMenuItem>
                  {findDuplicateKeys.size > 0 && (
                    <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                      <Eraser className="mr-2 h-4 w-4 text-amber-500" />
                      <span className="text-amber-500">一键清理重复项</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => fetchTokens()}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    <span>刷新列表</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <CardDescription>
            管理您保存的认证令牌
            {tokens.length > 0 && ` (${tokens.length}个)`}
          </CardDescription>
        </CardHeader>
      )}

      <CardContent className={`relative z-10 ${!hideHeader ? 'pt-0' : 'pt-4'}`}>
        {showControls && tokens.length > 0 && (
          <div className="flex flex-col md:flex-row gap-2 items-start md:items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索令牌名称、发行者或密钥..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-9 h-10 focus-visible:ring-cyber-blue/20 border-border/30 bg-background/60 backdrop-blur-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Select value={filterBy} onValueChange={handleFilterChange}>
                <SelectTrigger className="h-10 w-full md:w-[140px] focus:ring-cyber-blue/20 border-border/30 bg-background/60 backdrop-blur-sm">
                  <SelectValue placeholder="全部令牌" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部令牌</SelectItem>
                  <SelectItem value="favorites">收藏的令牌</SelectItem>
                  <SelectItem value="duplicates">重复的令牌</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="h-10 w-full md:w-[140px] focus:ring-cyber-blue/20 border-border/30 bg-background/60 backdrop-blur-sm">
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="favorite">收藏优先</SelectItem>
                  <SelectItem value="name">按名称</SelectItem>
                  <SelectItem value="issuer">按发行者</SelectItem>
                  <SelectItem value="newest">最新添加</SelectItem>
                </SelectContent>
              </Select>

              {processedTokens.length > PAGE_SIZES[0] && (
                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="h-10 w-full md:w-[110px] focus:ring-cyber-blue/20 border-border/30 bg-background/60 backdrop-blur-sm">
                    <SelectValue placeholder="每页数量" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZES.map(size => (
                      <SelectItem key={size} value={size.toString()}>
                        {size} 条/页
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        )}

        {findDuplicateKeys.size > 0 && !hideHeader && (
          <div className="mb-4 p-3 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-sm">发现 {findDuplicateKeys.size} 个重复密钥，可能导致意外覆盖</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-500"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Eraser className="mr-2 h-3.5 w-3.5" />
              清理重复项
            </Button>
          </div>
        )}

        {tokens.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border/50 rounded-md">
            <QrCode className="h-10 w-10 mx-auto text-muted-foreground mb-2 opacity-30" />
            <p className="text-muted-foreground">您还没有保存任何认证令牌</p>
          </div>
        ) : processedTokens.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border/50 rounded-md">
            <Search className="h-10 w-10 mx-auto text-muted-foreground mb-2 opacity-30" />
            <p className="text-muted-foreground">没有匹配的搜索结果</p>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden border-border/30 bg-background/60 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted/20 bg-muted/10">
                    <TableHead className="w-[60px]" title="收藏状态"></TableHead>
                    <TableHead>名称</TableHead>
                    <TableHead className="hidden sm:table-cell">发行者</TableHead>
                    <TableHead>密钥</TableHead>
                    {showControls && <TableHead className="text-right w-[80px]">操作</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTokens.map((token) => {
                    const isDuplicate = token.id && findDuplicateKeys.has(token.id);
                    const isMarkedForDeletion = token.id && duplicatesToDelete.includes(token.id);

                    return (
                      <TableRow
                        key={token.id}
                        className={`hover:bg-muted/30 transition-all ${isDuplicate ? (isMarkedForDeletion ? 'bg-red-500/5 opacity-70' : 'bg-amber-500/5') : ''
                          }`}
                      >
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => token.id && handleToggleFavorite(token.id)}
                            className="h-8 w-8 rounded-full"
                          >
                            {token.is_favorite ? (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            ) : (
                              <StarOff className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex flex-col max-w-[150px] md:max-w-none">
                            <span className="truncate">
                              {token.name}
                            </span>
                            <span className="text-xs text-muted-foreground sm:hidden truncate">
                              {token.issuer || "-"}
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {isDuplicate && (
                                <Badge
                                  variant="outline"
                                  className={`w-fit text-[10px] h-4 ${isMarkedForDeletion
                                    ? 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20'
                                    : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/20'
                                    }`}
                                >
                                  {isMarkedForDeletion ? '将被删除' : '重复'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{token.issuer || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className={`font-mono text-xs sm:text-sm px-1.5 py-0.5 rounded ${isDuplicate ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-muted/40'
                              }`}>
                              {token.secret.substring(0, 4)}
                              <span className="text-muted-foreground">···</span>
                              {token.secret.substring(token.secret.length - 2)}
                            </span>
                            <CopyButton
                              value={token.secret}
                              className="h-8 w-8 ml-1 sm:ml-2"
                              variant="ghost"
                              size="icon"
                              tooltipMessage="复制密钥"
                              onCopy={handleCopySuccess}
                            />
                          </div>
                        </TableCell>
                        {showControls && (
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => token.id && handleDelete(token.id)}
                              className="h-8 w-8 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* 分页控制 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border/30">
                <div className="text-xs text-muted-foreground">
                  第 {(currentPage - 1) * pageSize + 1}-
                  {Math.min(currentPage * pageSize, processedTokens.length)} 条，
                  共 {processedTokens.length} 条
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(1)}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-1 px-2">
                    {getPageNumbers().map((page) => {
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          className={`h-8 w-8 ${page === currentPage ? 'bg-cyber-blue text-white' : ''}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(totalPages)}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="relative z-10 text-xs text-muted-foreground flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-between">
        <p>
          {findDuplicateKeys.size > 0 ? (
            <span className="flex flex-wrap items-center gap-1">
              <Layers className="h-3.5 w-3.5 flex-shrink-0" />
              <span>发现 {findDuplicateKeys.size} 个重复的密钥</span>
              <Button
                variant="link"
                className="h-auto p-0 text-xs text-cyber-blue flex-shrink-0"
                onClick={toggleDuplicatesView}
              >
                {showDuplicates ? "显示全部" : "只看重复"}
              </Button>
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              点击星标可以将令牌标记为收藏
            </span>
          )}
        </p>
        {processedTokens.length > 0 && (
          <p className="whitespace-nowrap">显示 {Math.min(paginatedTokens.length, processedTokens.length)} 个结果，共 {tokens.length} 个令牌</p>
        )}
      </CardFooter>

      {/* 删除重复项确认对话框 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              删除重复的认证令牌
            </DialogTitle>
            <DialogDescription>
              系统将保留每组重复令牌中<strong className="text-foreground">最后添加</strong>的一个，删除其余重复项。
            </DialogDescription>
          </DialogHeader>

          <div className="py-3">
            <div className="p-3 rounded-md bg-amber-500/10 border border-amber-500/20 text-sm">
              <p className="mb-2">重复判断标准：</p>
              <p>• 名称、发行者和密钥<strong>完全相同</strong>的令牌被视为重复</p>
              <div className="h-px bg-amber-500/20 my-2"></div>
              <p className="mb-2">将删除以下重复项：</p>
              <p>• 重复令牌组数: <strong>{findDuplicateKeys.size}</strong></p>
              <p>• 需要删除项数: <strong>{duplicatesToDelete.length}</strong></p>
            </div>

            <p className="text-sm mt-3 text-muted-foreground">
              删除后将自动刷新列表。此操作不可撤销，确认继续？
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deletingDuplicates}
            >
              取消
            </Button>
            <Button
              variant="default"
              onClick={handleDeleteDuplicates}
              disabled={deletingDuplicates || duplicatesToDelete.length === 0}
              className="bg-amber-500 hover:bg-amber-600"
            >
              {deletingDuplicates ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  删除中...
                </>
              ) : (
                <>
                  <Eraser className="mr-2 h-4 w-4" />
                  确认删除
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除全部令牌确认对话框 */}
      <Dialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
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
              <p className="mb-2">即将删除：</p>
              <p>• 所有令牌: <strong>{tokens.length}</strong> 个</p>
              <p>• 包含收藏令牌: <strong>{tokens.filter(t => t.is_favorite).length}</strong> 个</p>
              <div className="h-px bg-red-500/20 my-2"></div>
              <p className="text-red-500 font-medium">此操作将清空您的所有令牌！</p>
            </div>

            <p className="text-sm mt-3 text-muted-foreground">
              删除后将无法恢复。此操作不可撤销，确认继续？
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteAllDialog(false)}
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
    </Card>
  );
} 
