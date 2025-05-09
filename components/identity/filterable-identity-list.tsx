"use client";

import { useState, useEffect } from "react";
import { IdentityType, Country, Gender } from "@/lib/types";
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
  Table as TableIcon,
  Filter,
  ChevronDown,
  Users,
  Clock,
  SortAsc,
  SortDesc,
  AlignJustify,
  User,
  UserCircle2,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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
  const [selectedGender, setSelectedGender] = useState<Gender | "all">("all");
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 100]);

  // 当身份列表变化时更新过滤后的身份列表
  useEffect(() => {
    applyFilters();
  }, [identities]);

  // 提取所有标签
  const allTags = Array.from(new Set<string>(
    identities.flatMap(identity => identity.tags || [])
  )).sort();

  // 提取所有国家
  const countriesInUse = Array.from(new Set<Country>(
    identities.map(identity => identity.country)
  )).sort();

  // 计算标签数量
  const getTagCount = (tag: string) => {
    return identities.filter(identity =>
      identity.tags && identity.tags.includes(tag)
    ).length;
  };

  // 计算国家数量
  const getCountryCount = (country: Country) => {
    return identities.filter(identity => identity.country === country).length;
  };

  // 计算性别数量
  const getGenderCount = (gender: Gender) => {
    return identities.filter(identity => identity.gender === gender).length;
  };

  // 计算年龄
  const calculateAge = (birthDate: string) => {
    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

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
        (identity.occupation && identity.occupation.toLowerCase().includes(term)) ||
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

    // 按性别筛选
    if (selectedGender && selectedGender !== "all") {
      result = result.filter(identity =>
        identity.gender === selectedGender
      );
    }

    // 按年龄范围筛选
    result = result.filter(identity => {
      const age = calculateAge(identity.birth_date);
      return age >= ageRange[0] && age <= ageRange[1];
    });

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
  }, [identities, searchTerm, selectedTag, selectedCountry, showFavoritesOnly, sortBy, selectedGender, ageRange]);

  // 重置年龄范围
  const resetAgeRange = () => {
    setAgeRange([0, 100]);
  };

  // 清除所有筛选条件
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedTag(null);
    setSelectedCountry("all");
    setShowFavoritesOnly(false);
    setSortBy("newest");
    setSelectedGender("all");
    resetAgeRange();
  };

  // 是否有任何筛选条件
  const hasFilters = () => {
    return searchTerm !== "" ||
      selectedTag !== null ||
      selectedCountry !== "all" ||
      showFavoritesOnly ||
      selectedGender !== "all" ||
      ageRange[0] !== 0 ||
      ageRange[1] !== 100;
  };

  return (
    <div className="space-y-6">
      {/* 搜索和视图控制 */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-3/5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索名称、身份证号、邮箱、地址或职业..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 w-full border-dashed focus:border-solid"
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "text-xs border-dashed",
                    hasFilters() ? "border-primary text-primary" : ""
                  )}
                >
                  <Filter className="h-3.5 w-3.5 mr-1" />
                  筛选
                  {hasFilters() && <Badge className="ml-1 h-5 bg-primary text-xs">已启用</Badge>}
                  <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm flex items-center">
                    <Filter className="h-4 w-4 mr-1" />
                    高级筛选
                  </h4>

                  <div className="space-y-2">
                    <Label className="text-xs">国家</Label>
                    <Select
                      value={selectedCountry}
                      onValueChange={(value) => setSelectedCountry(value as Country | "all")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择国家" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <div className="flex items-center justify-between w-full">
                            <span>所有国家</span>
                            <Badge variant="outline" className="ml-2">
                              {identities.length}
                            </Badge>
                          </div>
                        </SelectItem>
                        {countriesInUse.map((country) => (
                          <SelectItem key={country} value={country}>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center">
                                <span className="mr-1">{
                                  country === "CN" ? "🇨🇳" :
                                    country === "US" ? "🇺🇸" :
                                      country === "UK" ? "🇬🇧" :
                                        country === "JP" ? "🇯🇵" :
                                          country === "CA" ? "🇨🇦" :
                                            country === "AU" ? "🇦🇺" : "🏳️"
                                }</span>
                                <span>{COUNTRY_INFO[country]?.name}</span>
                              </div>
                              <Badge variant="outline" className="ml-2">
                                {getCountryCount(country)}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">性别</Label>
                    <Select
                      value={selectedGender}
                      onValueChange={(value) => setSelectedGender(value as Gender | "all")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择性别" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <div className="flex items-center justify-between w-full">
                            <span>所有性别</span>
                            <Badge variant="outline" className="ml-2">
                              {identities.length}
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="男">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <User className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                              <span>男</span>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              {getGenderCount("男")}
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="女">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <UserCircle2 className="w-3.5 h-3.5 mr-1.5 text-pink-500" />
                              <span>女</span>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              {getGenderCount("女")}
                            </Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">年龄范围</Label>
                      <button
                        className="text-xs text-primary"
                        onClick={resetAgeRange}
                      >
                        重置
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={ageRange[0]}
                        onChange={(e) => setAgeRange([parseInt(e.target.value) || 0, ageRange[1]])}
                        className="w-20 text-center"
                      />
                      <div className="flex-grow border-t border-border"></div>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={ageRange[1]}
                        onChange={(e) => setAgeRange([ageRange[0], parseInt(e.target.value) || 100])}
                        className="w-20 text-center"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">标签</Label>
                    <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-1">
                      {allTags.length > 0 ? (
                        allTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant={selectedTag === tag ? "default" : "outline"}
                            className="cursor-pointer transition-colors"
                            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                            <span className="ml-1 text-xs opacity-70">
                              {getTagCount(tag)}
                            </span>
                          </Badge>
                        ))
                      ) : (
                        <div className="text-xs text-muted-foreground py-1">暂无标签</div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-xs h-8"
                      disabled={!hasFilters()}
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      清除全部
                    </Button>

                    <div className="flex items-center">
                      <Button
                        variant={showFavoritesOnly ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                        className="text-xs h-8"
                      >
                        <Heart className={cn(
                          "h-3.5 w-3.5 mr-1",
                          showFavoritesOnly ? "fill-white" : ""
                        )} />
                        {showFavoritesOnly ? "仅收藏" : "全部"}
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-dashed"
                >
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  排序
                  <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center">
                    <AlignJustify className="h-4 w-4 mr-1" />
                    排序方式
                  </h4>

                  <div className="space-y-1">
                    <Button
                      variant={sortBy === "newest" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSortBy("newest")}
                      className="w-full justify-start text-xs h-8"
                    >
                      <SortDesc className="h-3.5 w-3.5 mr-1.5" />
                      最新创建
                    </Button>
                    <Button
                      variant={sortBy === "oldest" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSortBy("oldest")}
                      className="w-full justify-start text-xs h-8"
                    >
                      <SortAsc className="h-3.5 w-3.5 mr-1.5" />
                      最早创建
                    </Button>
                    <Button
                      variant={sortBy === "name" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSortBy("name")}
                      className="w-full justify-start text-xs h-8"
                    >
                      <Users className="h-3.5 w-3.5 mr-1.5" />
                      姓名字母
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <div className="bg-muted/30 rounded-md border flex overflow-hidden">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      className="h-9 w-9 rounded-none border-0"
                      onClick={() => setViewMode("grid")}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>网格视图</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      className="h-9 w-9 rounded-none border-0"
                      onClick={() => setViewMode("list")}
                    >
                      <ListIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>列表视图</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === "table" ? "default" : "ghost"}
                      size="icon"
                      className="h-9 w-9 rounded-none border-0"
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

        {/* 筛选标签展示 */}
        {hasFilters() && (
          <div className="flex flex-wrap gap-2 items-center mt-1">
            {selectedCountry !== "all" && (
              <Badge variant="secondary" className="text-xs px-2 py-1 gap-1">
                <Globe className="h-3 w-3" />
                {COUNTRY_INFO[selectedCountry]?.name || selectedCountry}
                <button
                  className="ml-1 hover:text-foreground"
                  onClick={() => setSelectedCountry("all")}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {selectedGender !== "all" && (
              <Badge variant="secondary" className="text-xs px-2 py-1 gap-1">
                {selectedGender === "男" ? (
                  <User className="h-3 w-3" />
                ) : (
                  <UserCircle2 className="h-3 w-3" />
                )}
                {selectedGender}
                <button
                  className="ml-1 hover:text-foreground"
                  onClick={() => setSelectedGender("all")}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {(ageRange[0] !== 0 || ageRange[1] !== 100) && (
              <Badge variant="secondary" className="text-xs px-2 py-1 gap-1">
                <Calendar className="h-3 w-3" />
                {ageRange[0]}-{ageRange[1]}岁
                <button
                  className="ml-1 hover:text-foreground"
                  onClick={resetAgeRange}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {selectedTag && (
              <Badge variant="secondary" className="text-xs px-2 py-1 gap-1">
                <Tag className="h-3 w-3" />
                {selectedTag}
                <button
                  className="ml-1 hover:text-foreground"
                  onClick={() => setSelectedTag(null)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {showFavoritesOnly && (
              <Badge variant="secondary" className="text-xs px-2 py-1 gap-1">
                <Star className="h-3 w-3 fill-current" />
                收藏
                <button
                  className="ml-1 hover:text-foreground"
                  onClick={() => setShowFavoritesOnly(false)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-7 text-xs ml-2"
            >
              <X className="h-3 w-3 mr-1" />
              清除全部
            </Button>
          </div>
        )}
      </div>

      {/* 结果计数 */}
      <div className="text-xs text-muted-foreground">
        共 {filteredIdentities.length} 个身份 {identities.length !== filteredIdentities.length && `(已筛选自 ${identities.length} 个)`}
      </div>

      {/* 身份列表 */}
      <IdentityList
        identities={filteredIdentities}
        viewMode={viewMode}
      />
    </div>
  );
}
