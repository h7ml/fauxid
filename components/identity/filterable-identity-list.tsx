"use client";

import { useState, useEffect } from "react";
import { IdentityType, Country } from "@/lib/types";
import IdentityList from "./identity-list";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { COUNTRY_INFO } from "@/lib/country-configs";
import {
  Search,
  Tag,
  Globe,
  X,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Star,
  Calendar,
  Table as TableIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FilterableIdentityListProps {
  identities: IdentityType[];
}

export default function FilterableIdentityList({ identities }: FilterableIdentityListProps) {
  const [filteredIdentities, setFilteredIdentities] = useState<IdentityType[]>(identities);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("grid");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [showFilters, setShowFilters] = useState(false);

  // 当身份列表变化时更新过滤后的身份列表
  useEffect(() => {
    applyFilters();
  }, [identities]);

  // 提取所有标签
  const allTags = new Set<string>();
  identities.forEach(identity => {
    if (identity.tags && identity.tags.length > 0) {
      identity.tags.forEach(tag => allTags.add(tag));
    }
  });

  // 提取所有国家
  const countriesInUse = new Set<Country>();
  identities.forEach(identity => {
    if (identity.country) {
      countriesInUse.add(identity.country);
    }
  });

  // 应用所有筛选条件
  const applyFilters = () => {
    let result = [...identities];

    // 按搜索词筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(identity =>
        identity.name.toLowerCase().includes(term) ||
        identity.id_number.toLowerCase().includes(term) ||
        (identity.email && identity.email.toLowerCase().includes(term)) ||
        (identity.address && identity.address.toLowerCase().includes(term)) ||
        (identity.notes && identity.notes.toLowerCase().includes(term))
      );
    }

    // 按标签筛选
    if (selectedTag) {
      result = result.filter(identity =>
        identity.tags && identity.tags.includes(selectedTag)
      );
    }

    // 按国家筛选
    if (selectedCountry && selectedCountry !== "all") {
      result = result.filter(identity =>
        identity.country === selectedCountry
      );
    }

    // 只显示收藏
    if (showFavoritesOnly) {
      result = result.filter(identity => identity.favorite === true);
    }

    // 排序结果
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredIdentities(result);
  };

  // 当筛选条件变化时更新结果
  useEffect(() => {
    applyFilters();
  }, [identities, searchTerm, selectedTag, selectedCountry, showFavoritesOnly, sortBy]);

  // 清除所有筛选条件
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedTag(null);
    setSelectedCountry("all");
    setShowFavoritesOnly(false);
    setSortBy("newest");
  };

  return (
    <div className="space-y-6">
      {/* 搜索和视图控制 */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索名称、身份证号、邮箱或地址..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 w-full"
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showFavoritesOnly ? "default" : "outline"}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                >
                  <Star className={`h-4 w-4 ${showFavoritesOnly ? "fill-white" : ""}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{showFavoritesOnly ? "显示全部" : "只显示收藏"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>高级筛选</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex border rounded-md overflow-hidden">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    className="h-9 w-9 rounded-none"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>网格视图</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    className="h-9 w-9 rounded-none"
                    onClick={() => setViewMode("list")}
                  >
                    <ListIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>列表视图</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="icon"
                    className="h-9 w-9 rounded-none"
                    onClick={() => setViewMode("table")}
                  >
                    <TableIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>表格视图</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* 高级筛选器 */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-muted/10 p-4 rounded-lg border animate-in slide-in-from-top-4 duration-300">
          {/* 标签筛选 */}
          <div>
            <Label htmlFor="tag-filter" className="mb-2 block text-sm font-medium flex items-center">
              <Tag className="w-3.5 h-3.5 mr-1.5" />
              按标签筛选
            </Label>
            <Select
              value={selectedTag || "all"}
              onValueChange={(value) => {
                setSelectedTag(value === "all" ? null : value);
              }}
            >
              <SelectTrigger id="tag-filter" className="w-full">
                <SelectValue placeholder="选择标签" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部标签</SelectItem>
                {Array.from(allTags).map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 国家筛选 */}
          <div>
            <Label htmlFor="country-filter" className="mb-2 block text-sm font-medium flex items-center">
              <Globe className="w-3.5 h-3.5 mr-1.5" />
              按国家筛选
            </Label>
            <Select
              value={selectedCountry}
              onValueChange={(value) => {
                setSelectedCountry(value as Country | "all");
              }}
            >
              <SelectTrigger id="country-filter" className="w-full">
                <SelectValue placeholder="选择国家" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部国家</SelectItem>
                {Array.from(countriesInUse).map(countryCode => (
                  <SelectItem key={countryCode} value={countryCode}>
                    {COUNTRY_INFO[countryCode]?.name || countryCode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 排序方式 */}
          <div>
            <Label htmlFor="sort-filter" className="mb-2 block text-sm font-medium flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              排序方式
            </Label>
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value as "newest" | "oldest" | "name");
              }}
            >
              <SelectTrigger id="sort-filter" className="w-full">
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">最新创建</SelectItem>
                <SelectItem value="oldest">最早创建</SelectItem>
                <SelectItem value="name">按名称</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 重置按钮 */}
          <div className="flex items-end">
            <Button
              variant="ghost"
              className="w-full"
              onClick={clearAllFilters}
            >
              重置所有筛选
            </Button>
          </div>
        </div>
      )}

      {/* 筛选结果摘要 */}
      <div className="flex flex-wrap items-center justify-between py-2 mb-4 border-b">
        <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-0">
          {selectedTag && (
            <Badge
              variant="secondary"
              className="flex items-center px-3 py-1 gap-1"
            >
              <Tag className="w-3 h-3" />
              {selectedTag}
              <button
                className="ml-1 hover:text-destructive"
                onClick={() => setSelectedTag(null)}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedCountry && selectedCountry !== "all" && (
            <Badge
              variant="secondary"
              className="flex items-center px-3 py-1 gap-1"
            >
              <Globe className="w-3 h-3" />
              {COUNTRY_INFO[selectedCountry as Country]?.name || selectedCountry}
              <button
                className="ml-1 hover:text-destructive"
                onClick={() => setSelectedCountry("all")}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {showFavoritesOnly && (
            <Badge
              variant="secondary"
              className="flex items-center px-3 py-1 gap-1"
            >
              <Star className="w-3 h-3" />
              仅显示收藏
              <button
                className="ml-1 hover:text-destructive"
                onClick={() => setShowFavoritesOnly(false)}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {sortBy !== "newest" && (
            <Badge
              variant="secondary"
              className="flex items-center px-3 py-1 gap-1"
            >
              <Calendar className="w-3 h-3" />
              {sortBy === "oldest" ? "最早创建" : "按名称"}
              <button
                className="ml-1 hover:text-destructive"
                onClick={() => setSortBy("newest")}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {(selectedTag || (selectedCountry && selectedCountry !== "all") || showFavoritesOnly || sortBy !== "newest" || searchTerm) && (
            <button
              className="text-xs text-muted-foreground hover:text-destructive underline"
              onClick={clearAllFilters}
            >
              清除所有筛选
            </button>
          )}
        </div>
        <div className="text-sm font-medium">
          共 {filteredIdentities.length} 条结果
        </div>
      </div>

      <IdentityList
        identities={filteredIdentities}
        viewMode={viewMode}
      />
    </div>
  );
}
