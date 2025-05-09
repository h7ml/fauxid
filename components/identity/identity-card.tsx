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
  Globe,
  MapPin,
  Briefcase,
  Heart,
  Eye,
  User,
  Building,
  Network,
  UserCircle2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface IdentityCardProps {
  identity: IdentityType;
  showActions?: boolean;
  onDelete?: () => void;
  viewMode?: "grid" | "list";
}

export default function IdentityCard({
  identity,
  showActions = true,
  onDelete,
  viewMode = "grid"
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

  // 计算国旗表情
  const getFlagEmoji = (countryCode: Country) => {
    const info = COUNTRY_INFO[countryCode];
    // 简单使用第一个字符作为备用字符
    return "🏳️";
  };

  return (
    <Card className="w-full overflow-hidden relative hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      {/* 收藏标记 */}
      {isFavorite && (
        <div className="absolute top-0 right-0 z-10 w-12 h-12 overflow-hidden">
          <div className="absolute top-0 right-0 bg-yellow-400 w-16 h-16 -rotate-45 transform origin-top-right"></div>
          <Star className="absolute top-2 right-2 h-4 w-4 text-white" />
        </div>
      )}

      {/* 头像显示 */}
      {identity.avatar_url && (
        <div className="w-full h-48 bg-gradient-to-b from-muted/50 to-muted relative overflow-hidden">
          <Image
            src={identity.avatar_url}
            alt={identity.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent h-16"></div>
        </div>
      )}

      <CardHeader className={cn("pb-2", identity.avatar_url ? "-mt-6 relative z-10" : "")}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-primary" />
              <CardTitle className="text-xl leading-tight">{identity.name}</CardTitle>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <CardDescription className="flex items-center">
                <UserCircle2 className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                <span>{identity.gender || '未知'}</span>
              </CardDescription>

              <CardDescription className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                <span>{identity.birth_date}</span>
                <span className="ml-1 px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded">{age}岁</span>
              </CardDescription>

              <CardDescription className="flex items-center">
                <Flag className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                <span className="mr-1">{getFlagEmoji(identity.country)}</span>
                <span>{COUNTRY_INFO[identity.country]?.name || "未知"}</span>
              </CardDescription>
            </div>
          </div>

          {showActions && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
              className="h-8 w-8"
              title={isFavorite ? "取消收藏" : "收藏"}
            >
              {isFavorite ? (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ) : (
                <StarOff className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {/* 职业信息和标签 */}
        <div className="flex flex-wrap gap-2 mt-2">
          {identity.occupation && (
            <Badge variant="outline" className="flex items-center text-xs gap-1 bg-muted/30">
              <Briefcase className="w-3 h-3" />
              {identity.occupation}
            </Badge>
          )}

          {identity.tags && identity.tags.length > 0 && identity.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 flex-grow pb-2">
        {/* 身份信息区域 - 带卡片式分隔 */}
        <div className="grid grid-cols-1 gap-2">
          {/* 身份证件信息卡片 */}
          <div className="bg-muted/10 p-3 rounded-md border border-border/50">
            <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1" />
              证件信息
            </h4>

            <div className="space-y-2.5">
              <div className="text-sm flex items-center">
                <Fingerprint className="w-3.5 h-3.5 mr-2 text-primary/70" />
                <span className="font-medium text-xs">
                  {COUNTRY_INFO[identity.country]?.idNumberName || "身份证号"}:
                </span>
                <span className="ml-2 truncate text-sm">{identity.id_number}</span>
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
                  <BookOpen className="w-3.5 h-3.5 mr-2 text-primary/70" />
                  <span className="font-medium text-xs">护照号码:</span>
                  <span className="ml-2 truncate text-sm">{identity.passport_number}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-auto"
                    onClick={() => identity.passport_number && copyToClipboard(identity.passport_number, "护照号码已复制到剪贴板")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {identity.drivers_license && (
                <div className="text-sm flex items-center">
                  <Car className="w-3.5 h-3.5 mr-2 text-primary/70" />
                  <span className="font-medium text-xs">驾照号码:</span>
                  <span className="ml-2 truncate text-sm">{identity.drivers_license}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-auto"
                    onClick={() => identity.drivers_license && copyToClipboard(identity.drivers_license, "驾照号码已复制到剪贴板")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* 联系方式 */}
          <div className="bg-muted/10 p-3 rounded-md border border-border/50">
            <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center">
              <Network className="w-3.5 h-3.5 mr-1" />
              联系方式
            </h4>

            <div className="space-y-2.5">
              <div className="text-sm flex items-center">
                <Mail className="w-3.5 h-3.5 mr-2 text-primary/70" />
                <span className="font-medium text-xs">邮箱:</span>
                <span className="ml-2 truncate text-sm">{identity.email}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-auto"
                  onClick={() => copyToClipboard(identity.email, "邮箱地址已复制到剪贴板")}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>

              <div className="text-sm flex items-center">
                <Phone className="w-3.5 h-3.5 mr-2 text-primary/70" />
                <span className="font-medium text-xs">电话:</span>
                <span className="ml-2 truncate text-sm">{identity.phone}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-auto"
                  onClick={() => copyToClipboard(identity.phone, "电话号码已复制到剪贴板")}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>

              <div className="text-sm">
                <div className="flex items-start">
                  <MapPin className="w-3.5 h-3.5 mr-2 text-primary/70 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-xs block">地址:</span>
                    <span className="text-sm break-words">{identity.address}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-auto float-right"
                      onClick={() => copyToClipboard(identity.address, "地址已复制到剪贴板")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 信用卡信息 */}
          {identity.credit_card && (
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-3 rounded-md border border-primary/20">
              <h4 className="text-xs font-medium mb-2 flex items-center text-primary/80">
                <CreditCard className="w-3.5 h-3.5 mr-1" />
                信用卡信息
              </h4>

              <div className="space-y-2">
                <div className="text-sm flex items-center justify-between">
                  <span className="font-medium text-xs">{identity.credit_card.type}</span>
                  <Badge variant="outline" className="text-xs">
                    {identity.credit_card.type}
                  </Badge>
                </div>

                <div className="text-sm flex items-center">
                  <span className="font-medium text-xs">卡号:</span>
                  <span className="ml-2 font-mono tracking-wider">
                    {identity.credit_card.number.replace(/(\d{4})/g, '$1 ').trim()}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-auto"
                    onClick={() => identity.credit_card && copyToClipboard(identity.credit_card.number, "信用卡号已复制到剪贴板")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium">有效期:</span>
                    <span className="ml-1 font-mono">{identity.credit_card.expiration}</span>
                  </div>
                  <div>
                    <span className="font-medium">CVV:</span>
                    <span className="ml-1 font-mono">{identity.credit_card.cvv}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-1 inline-flex items-center justify-center"
                      onClick={() => identity.credit_card && copyToClipboard(identity.credit_card.cvv, "CVV码已复制到剪贴板")}
                    >
                      <Copy className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex items-center justify-between mt-auto">
        <div className="text-xs text-muted-foreground">
          {new Date(identity.created_at).toLocaleDateString()}
        </div>
        <div className="flex space-x-1">
          {showActions && (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-8 px-2 text-xs"
              >
                <Link href={`/protected/identities/${identity.id}`}>
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  详情
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-8 px-2 text-destructive hover:text-destructive text-xs"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                删除
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
} 
