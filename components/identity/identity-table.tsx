"use client";

import React, { useState } from "react";
import { IdentityType } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Copy,
  Eye,
  Star,
  StarOff,
  ArrowDown,
  ArrowUp,
  Trash2,
} from "lucide-react";
import { toggleFavorite, deleteIdentity } from "@/app/actions/identity-actions";
import { useToast } from "@/components/ui/use-toast";
import { COUNTRY_INFO } from "@/lib/country-configs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { safeCopyToClipboard } from "@/utils/clipboard";

interface IdentityTableProps {
  identities: IdentityType[];
  onDelete?: (id: string) => void;
}

export default function IdentityTable({ identities, onDelete }: IdentityTableProps) {
  const { toast } = useToast();

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 排序状态
  const [sortField, setSortField] = useState<keyof IdentityType>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // 处理排序
  const handleSort = (field: keyof IdentityType) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // 排序数据
  const sortedIdentities = [...identities].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (fieldA === undefined || fieldB === undefined) return 0;

    let comparison = 0;
    if (typeof fieldA === "string" && typeof fieldB === "string") {
      comparison = fieldA.localeCompare(fieldB);
    } else if (fieldA instanceof Date && fieldB instanceof Date) {
      comparison = fieldA.getTime() - fieldB.getTime();
    } else if (typeof fieldA === "boolean" && typeof fieldB === "boolean") {
      comparison = fieldA === fieldB ? 0 : fieldA ? 1 : -1;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  // 计算分页数据
  const totalPages = Math.ceil(sortedIdentities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentIdentities = sortedIdentities.slice(startIndex, endIndex);

  // 生成分页链接
  const pageNumbers = [];
  const maxPageLinks = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxPageLinks / 2));
  let endPage = Math.min(totalPages, startPage + maxPageLinks - 1);

  if (endPage - startPage + 1 < maxPageLinks) {
    startPage = Math.max(1, endPage - maxPageLinks + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // 处理收藏切换
  const handleToggleFavorite = async (identity: IdentityType) => {
    const formData = new FormData();
    formData.append("id", identity.id);
    formData.append("favorite", (!identity.favorite).toString());

    const result = await toggleFavorite(formData);
    if (result.success) {
      toast({
        title: identity.favorite ? "已取消收藏" : "已添加到收藏",
        description: `身份 "${identity.name}" ${identity.favorite ? "已从收藏中移除" : "已添加到收藏"}`,
        variant: "default",
      });
    }
  };

  // 处理删除
  const handleDelete = async (identity: IdentityType) => {
    if (confirm(`确定要删除 "${identity.name}" 吗？`)) {
      const formData = new FormData();
      formData.append("id", identity.id);

      const result = await deleteIdentity(formData);
      if (result.success) {
        toast({
          title: "删除成功",
          description: `身份 "${identity.name}" 已被删除`,
          variant: "default",
        });
        onDelete?.(identity.id);
      } else {
        toast({
          title: "删除失败",
          description: result.error || "未知错误",
          variant: "destructive",
        });
      }
    }
  };

  // 复制文本到剪贴板
  const copyToClipboard = async (text: string, description: string) => {
    const success = await safeCopyToClipboard(text);
    if (success) {
      toast({
        title: "复制成功",
        description,
        variant: "default",
      });
    } else {
      toast({
        title: "复制失败",
        description: "无法访问剪贴板",
        variant: "destructive",
      });
    }
  };

  // 截断文本
  const truncateText = (text: string, maxLength: number = 30) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  // 渲染排序图标
  const renderSortIcon = (field: keyof IdentityType) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ?
      <ArrowUp className="ml-1 h-4 w-4 inline" /> :
      <ArrowDown className="ml-1 h-4 w-4 inline" />;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="w-[60px] text-center cursor-pointer"
                onClick={() => handleSort("favorite")}
              >
                收藏{renderSortIcon("favorite")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                姓名{renderSortIcon("name")}
              </TableHead>
              <TableHead>
                性别
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("birth_date")}
              >
                出生日期{renderSortIcon("birth_date")}
              </TableHead>
              <TableHead>
                国家
              </TableHead>
              <TableHead>
                证件号码
              </TableHead>
              <TableHead>
                电话
              </TableHead>
              <TableHead>
                邮箱
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("created_at")}
              >
                创建时间{renderSortIcon("created_at")}
              </TableHead>
              <TableHead className="text-right">
                操作
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentIdentities.map((identity) => (
              <TableRow key={identity.id}>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleToggleFavorite(identity)}
                  >
                    {identity.favorite ? (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-medium">
                  {identity.name}
                </TableCell>
                <TableCell>
                  {identity.gender || "未知"}
                </TableCell>
                <TableCell>
                  {identity.birth_date}
                </TableCell>
                <TableCell>
                  {COUNTRY_INFO[identity.country]?.name || identity.country}
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <span className="truncate max-w-[100px] inline-block">
                            {identity.id_number}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-1"
                            onClick={() => copyToClipboard(identity.id_number, "身份证号已复制到剪贴板")}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{identity.id_number}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <span className="truncate max-w-[100px] inline-block">
                            {identity.phone}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-1"
                            onClick={() => copyToClipboard(identity.phone, "电话号码已复制到剪贴板")}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{identity.phone}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <span className="truncate max-w-[120px] inline-block">
                            {identity.email}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-1"
                            onClick={() => copyToClipboard(identity.email, "邮箱地址已复制到剪贴板")}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{identity.email}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  {new Date(identity.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 w-8 p-0"
                  >
                    <Link href={`/protected/identities/${identity.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(identity)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {startPage > 1 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      setCurrentPage(1);
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                {startPage > 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              </>
            )}

            {pageNumbers.map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === pageNum}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    setCurrentPage(pageNum);
                  }}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      setCurrentPage(totalPages);
                    }}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
} 
