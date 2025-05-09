"use client";

import { IdentityType, Country } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { COUNTRY_INFO } from "@/lib/country-configs";
import { toggleFavorite, deleteIdentity } from "@/app/actions/identity-actions";
import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  GraduationCap,
  Phone,
  Mail,
  Home,
  Tag,
  FileText,
  Fingerprint,
  Trash2,
  Copy,
  ExternalLink
} from "lucide-react";

interface IdentityCardProps {
  identity: IdentityType;
  showActions?: boolean;
  onDelete?: () => void;
}

export default function IdentityCard({
  identity,
  showActions = true,
  onDelete
}: IdentityCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(identity.favorite || false);

  const birthYear = new Date(identity.birth_date).getFullYear();
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  const formattedBirthDate = new Date(identity.birth_date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // 获取国家信息
  const countryInfo = COUNTRY_INFO[identity.country as Country] || COUNTRY_INFO.CN;

  async function handleToggleFavorite() {
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("id", identity.id);
      formData.append("favorite", isFavorite.toString());

      const result = await toggleFavorite(formData);

      if (result.success) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error("切换收藏状态失败:", error);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleDelete() {
    if (!confirm("确定要删除这个身份信息吗？")) {
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("id", identity.id);

      const result = await deleteIdentity(formData);

      if (result.success && onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("删除身份信息失败:", error);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="bg-primary/5 pb-3 flex-shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 flex-wrap">
              {identity.name}
              <Badge variant="outline" className="text-xs font-normal">{countryInfo.name}</Badge>
            </CardTitle>
            <CardDescription className="mt-1">{age}岁 | {identity.gender} | {identity.occupation || "未知职业"}</CardDescription>
          </div>
          {showActions && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
              disabled={isProcessing}
              className="h-8 w-8 flex-shrink-0"
            >
              {isFavorite ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4 text-sm flex-grow">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-start gap-3">
            <Fingerprint className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <span className="break-all">{identity.id_number}</span>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <span>{formattedBirthDate}</span>
          </div>
          <div className="flex items-start gap-3">
            <GraduationCap className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <span>{identity.education || "未知"}</span>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <span>{identity.phone}</span>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <span className="break-all">{identity.email}</span>
          </div>
          <div className="flex items-start gap-3">
            <Home className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <span className="break-all">{identity.address}</span>
          </div>

          {/* 标签显示 */}
          {identity.tags && identity.tags.length > 0 && (
            <div className="flex items-start gap-3">
              <Tag className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="flex flex-wrap gap-1">
                {identity.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* 备注提示 */}
          {identity.notes && (
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground italic">查看详情...</span>
            </div>
          )}
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="flex justify-between border-t bg-muted/10 p-3 flex-shrink-0">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              const text = `姓名：${identity.name}\n性别：${identity.gender}\n年龄：${age}岁\n${countryInfo.idNumberName}：${identity.id_number}\n出生日期：${formattedBirthDate}\n职业：${identity.occupation || "未知"}\n教育程度：${identity.education || "未知"}\n联系电话：${identity.phone}\n电子邮箱：${identity.email}\n家庭住址：${identity.address}`;
              navigator.clipboard.writeText(text);
              alert("身份信息已复制到剪贴板");
            }}
            title="复制信息"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              asChild
              title="查看详情"
            >
              <Link href={`/protected/identities/${identity.id}`}>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={handleDelete}
              disabled={isProcessing}
              title="删除身份"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
} 
