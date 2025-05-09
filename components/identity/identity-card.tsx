"use client";

import { IdentityType, Country } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { COUNTRY_INFO } from "@/lib/country-configs";
import { toggleFavorite, deleteIdentity } from "@/app/actions/identity-actions";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  StarOff,
  Flag,
  CreditCard,
  BookOpen,
  Car,
  Globe
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  const [isFavorite, setIsFavorite] = useState(identity.favorite || false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // 计算年龄
  const birthYear = new Date(identity.birth_date).getFullYear();
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  // 处理收藏状态切换
  const handleToggleFavorite = async () => {
    const formData = new FormData();
    formData.append("id", identity.id);
    formData.append("favorite", (!isFavorite).toString());

    const result = await toggleFavorite(formData);
    if (result.success) {
      setIsFavorite(!isFavorite);
      toast({
        title: isFavorite ? "已取消收藏" : "已添加到收藏",
        description: `身份 "${identity.name}" ${isFavorite ? "已从收藏中移除" : "已添加到收藏"}`,
        variant: "default",
      });
    }
  };

  // 处理身份删除
  const handleDelete = async () => {
    if (confirm("确定要删除这个身份吗？")) {
      setIsDeleting(true);

      const formData = new FormData();
      formData.append("id", identity.id);

      const result = await deleteIdentity(formData);
      if (result.success) {
        toast({
          title: "删除成功",
          description: `身份 "${identity.name}" 已被删除`,
          variant: "default",
        });
        onDelete?.();
      } else {
        setIsDeleting(false);
        toast({
          title: "删除失败",
          description: result.error || "未知错误",
          variant: "destructive",
        });
      }
    }
  };

  // 复制文本并显示提示
  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "复制成功",
      description: description,
      variant: "default",
    });
  };

  return (
    <Card className="w-full overflow-hidden relative">
      {/* 头像显示 */}
      {identity.avatar_url && (
        <div className="w-full h-40 bg-muted relative overflow-hidden">
          <Image
            src={identity.avatar_url}
            alt={identity.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{identity.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Calendar className="w-4 h-4 mr-1" />
              {identity.birth_date} ({age}岁)
              <Flag className="w-4 h-4 ml-3 mr-1" />
              {COUNTRY_INFO[identity.country]?.name || "未知"}
              {identity.nationality && (
                <span className="ml-1">({identity.nationality})</span>
              )}
            </CardDescription>
          </div>

          {showActions && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
              className="h-8 w-8"
            >
              {isFavorite ? (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ) : (
                <StarOff className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="text-sm flex items-center">
          <Fingerprint className="w-4 h-4 mr-2" />
          <span className="font-medium">
            {COUNTRY_INFO[identity.country]?.idNumberName || "身份证号"}:
          </span>
          <span className="ml-2 truncate">{identity.id_number}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 ml-auto"
            onClick={() => copyToClipboard(identity.id_number, "身份证号已复制到剪贴板")}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>

        {identity.passport_number && (
          <div className="text-sm flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            <span className="font-medium">护照号码:</span>
            <span className="ml-2 truncate">{identity.passport_number}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-auto"
              onClick={() => {
                if (identity.passport_number) {
                  copyToClipboard(identity.passport_number, "护照号码已复制到剪贴板");
                }
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        )}

        {identity.drivers_license && (
          <div className="text-sm flex items-center">
            <Car className="w-4 h-4 mr-2" />
            <span className="font-medium">驾照号码:</span>
            <span className="ml-2 truncate">{identity.drivers_license}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-auto"
              onClick={() => {
                if (identity.drivers_license) {
                  copyToClipboard(identity.drivers_license, "驾照号码已复制到剪贴板");
                }
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        )}

        {identity.credit_card && (
          <div className="text-sm">
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              <span className="font-medium">信用卡:</span>
              <span className="ml-2">{identity.credit_card.type}</span>
            </div>
            <div className="ml-6 text-sm mt-1">
              <div className="flex items-center">
                <span className="font-medium">卡号:</span>
                <span className="ml-2 truncate">{identity.credit_card.number}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-auto"
                  onClick={() => {
                    if (identity.credit_card) {
                      copyToClipboard(identity.credit_card.number, "信用卡号已复制到剪贴板");
                    }
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">有效期:</span>
                  <span className="ml-2">{identity.credit_card.expiration}</span>
                </div>
                <div>
                  <span className="font-medium">CVV:</span>
                  <span className="ml-2">{identity.credit_card.cvv}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-1"
                    onClick={() => {
                      if (identity.credit_card) {
                        copyToClipboard(identity.credit_card.cvv, "CVV码已复制到剪贴板");
                      }
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-sm flex items-center">
          <Home className="w-4 h-4 mr-2" />
          <span className="truncate">{identity.address}</span>
        </div>

        <div className="text-sm flex items-center">
          <Phone className="w-4 h-4 mr-2" />
          <span>{identity.phone}</span>
        </div>

        <div className="text-sm flex items-center">
          <Mail className="w-4 h-4 mr-2" />
          <span className="truncate">{identity.email}</span>
        </div>

        {identity.occupation && (
          <div className="text-sm flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            <span>{identity.occupation}</span>
          </div>
        )}

        {identity.education && (
          <div className="text-sm flex items-center">
            <GraduationCap className="w-4 h-4 mr-2" />
            <span>{identity.education}</span>
          </div>
        )}

        {identity.social_media && identity.social_media.length > 0 && (
          <div className="text-sm mt-2">
            <div className="flex items-center mb-1">
              <Globe className="w-4 h-4 mr-2" />
              <span className="font-medium">社交媒体:</span>
            </div>
            <div className="flex flex-wrap gap-1 ml-6">
              {identity.social_media.map((account, index) => (
                <Badge key={index} variant="outline" className="flex items-center">
                  {account.platform}: {account.username}
                  {account.url && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-1"
                      onClick={() => {
                        if (account.url) {
                          window.open(account.url, '_blank');
                        }
                      }}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t p-4">
        <Link href={`/protected/identities/${identity.id}`} passHref>
          <Button variant="outline" size="sm">
            查看详情
          </Button>
        </Link>

        {showActions && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "删除中..." : "删除"}
            <Trash2 className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 
