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

interface FilterableIdentityListProps {
  identities: IdentityType[];
}

export default function FilterableIdentityList({ identities }: FilterableIdentityListProps) {
  const [filteredIdentities, setFilteredIdentities] = useState<IdentityType[]>(identities);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | "all">("all");

  // 当身份列表变化时重置过滤器
  useEffect(() => {
    setFilteredIdentities(identities);
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

  // 当筛选条件变化时更新结果
  useEffect(() => {
    console.log("Filter changed:", { searchTerm, selectedTag, selectedCountry });
    let result = [...identities];

    // 按搜索词筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(identity =>
        identity.name.toLowerCase().includes(term) ||
        identity.id_number.toLowerCase().includes(term) ||
        identity.email.toLowerCase().includes(term) ||
        identity.address.toLowerCase().includes(term) ||
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

    setFilteredIdentities(result);
  }, [identities, searchTerm, selectedTag, selectedCountry]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-muted/10 p-4 rounded-lg border">
        {/* 搜索框 */}
        <div>
          <Label htmlFor="search" className="mb-2 block text-sm font-medium">搜索</Label>
          <Input
            id="search"
            placeholder="搜索名称、身份证号..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {/* 标签筛选 */}
        <div>
          <Label htmlFor="tag-filter" className="mb-2 block text-sm font-medium">按标签筛选</Label>
          <Select
            value={selectedTag || "all"}
            onValueChange={(value) => {
              console.log("Tag selected:", value);
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
          <Label htmlFor="country-filter" className="mb-2 block text-sm font-medium">按国家筛选</Label>
          <Select
            value={selectedCountry}
            onValueChange={(value) => {
              console.log("Country selected:", value);
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
      </div>

      {/* 筛选结果 */}
      <div className="flex flex-wrap items-center justify-between py-2 mb-4 border-b">
        <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-0">
          {selectedTag && (
            <Badge
              variant="secondary"
              className="flex items-center px-3 py-1"
            >
              标签: {selectedTag}
              <button
                className="ml-2 hover:text-destructive"
                onClick={() => setSelectedTag(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Badge>
          )}
          {selectedCountry && selectedCountry !== "all" && (
            <Badge
              variant="secondary"
              className="flex items-center px-3 py-1"
            >
              国家: {COUNTRY_INFO[selectedCountry as Country]?.name || selectedCountry}
              <button
                className="ml-2 hover:text-destructive"
                onClick={() => setSelectedCountry("all")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Badge>
          )}
          {(selectedTag || (selectedCountry && selectedCountry !== "all") || searchTerm) && (
            <button
              className="text-xs text-muted-foreground hover:text-destructive underline"
              onClick={() => {
                setSelectedTag(null);
                setSelectedCountry("all");
                setSearchTerm("");
              }}
            >
              清除所有筛选
            </button>
          )}
        </div>
        <div className="text-sm font-medium">
          共 {filteredIdentities.length} 条结果
        </div>
      </div>

      <IdentityList identities={filteredIdentities} />
    </div>
  );
} 
