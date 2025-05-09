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
  ExternalLink,
  Star,
  StarOff
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
    <Card className="overflow-hidden h-full flex flex-col hover-card-effect card theme-transition">
      <CardHeader className="bg-primary/5 pb-3 flex-shrink-0 border-b border-border/30">
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
              className="h-8 w-8 flex-shrink-0 transition-colors"
            >
              {isFavorite ? (
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              ) : (
                <Star className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4 text-sm flex-grow">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-start gap-3 group">
            <Fingerprint className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
            <span className="break-all">{identity.id_number}</span>
          </div>
          <div className="flex items-start gap-3 group">
            <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
            <span>{formattedBirthDate}</span>
          </div>
          <div className="flex items-start gap-3 group">
            <GraduationCap className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
            <span>{identity.education || "未知"}</span>
          </div>
          <div className="flex items-start gap-3 group">
            <Phone className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
            <span>{identity.phone}</span>
          </div>
          <div className="flex items-start gap-3 group">
            <Mail className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
            <span className="break-all">{identity.email}</span>
          </div>
          <div className="flex items-start gap-3 group">
            <Home className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
            <span className="break-all">{identity.address}</span>
          </div>

          {/* 标签显示 */}
          {identity.tags && identity.tags.length > 0 && (
            <div className="flex items-start gap-3 group">
              <Tag className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
              <div className="flex flex-wrap gap-1">
                {identity.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* 备注提示 */}
          {identity.notes && (
            <div className="flex items-start gap-3 group">
              <FileText className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
              <span className="text-muted-foreground italic">查看详情...</span>
            </div>
          )}
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="flex justify-between border-t border-border/30 bg-muted/10 p-3 flex-shrink-0">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              const text = `姓名：${identity.name}\n性别：${identity.gender}\n年龄：${age}岁\n${countryInfo.idNumberName}：${identity.id_number}\n出生日期：${formattedBirthDate}\n职业：${identity.occupation || "未知"}\n教育程度：${identity.education || "未知"}\n联系电话：${identity.phone}\n电子邮箱：${identity.email}\n家庭住址：${identity.address}`;
              navigator.clipboard.writeText(text);
              alert("身份信息已复制到剪贴板");
            }}
            title="复制信息"
            className="transition-colors"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              asChild
              title="查看详情"
              className="transition-colors"
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
              title="删除"
              className="transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
} 
