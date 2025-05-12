"use client";

import { useState, useEffect } from "react";
import { getUserAuthenticatorTokens, deleteAuthenticatorToken, toggleFavoriteToken, AuthenticatorToken } from "@/app/actions/authenticator-actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { QrCode, Star, Trash2, Search, AlertCircle, StarOff } from "lucide-react";

interface AuthenticatorTokenListProps {
  showControls?: boolean;
}

export default function AuthenticatorTokenList({ showControls = true }: AuthenticatorTokenListProps) {
  const [tokens, setTokens] = useState<AuthenticatorToken[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchTokens();
  }, []);

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

  const filteredTokens = tokens.filter(token => {
    const query = searchQuery.toLowerCase();
    return (
      token.name.toLowerCase().includes(query) ||
      (token.issuer && token.issuer.toLowerCase().includes(query))
    );
  });

  // 按收藏状态和名称排序
  const sortedTokens = [...filteredTokens].sort((a, b) => {
    // 首先按收藏状态排序
    if (a.is_favorite && !b.is_favorite) return -1;
    if (!a.is_favorite && b.is_favorite) return 1;

    // 然后按名称字母顺序排序
    return a.name.localeCompare(b.name);
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>认证令牌</CardTitle>
          <CardDescription>加载中...</CardDescription>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          认证令牌
        </CardTitle>
        <CardDescription>
          管理您保存的认证令牌
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showControls && (
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索令牌..."
              value={searchQuery}
              onChange={handleSearch}
              className="flex-1"
            />
          </div>
        )}

        {tokens.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">您还没有保存任何认证令牌</p>
          </div>
        ) : sortedTokens.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">没有匹配的搜索结果</p>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>名称</TableHead>
                  <TableHead>发行者</TableHead>
                  <TableHead>密钥</TableHead>
                  {showControls && <TableHead className="text-right">操作</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTokens.map((token) => (
                  <TableRow key={token.id}>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => token.id && handleToggleFavorite(token.id)}
                        className="h-8 w-8"
                      >
                        {token.is_favorite ? (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <StarOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{token.name}</TableCell>
                    <TableCell>{token.issuer || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="font-mono text-sm">
                          {token.secret.substring(0, 4)}***
                        </span>
                        <CopyButton
                          value={token.secret}
                          className="h-8 w-8 ml-2"
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
                          className="h-8 w-8 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          提示: 点击星标可以将令牌标记为收藏
        </p>
      </CardFooter>
    </Card>
  );
} 
