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
  const [isHovered, setIsHovered] = useState(false);
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
    const countryCodeMap: Record<Country, string> = {
      CN: "🇨🇳",
      US: "🇺🇸",
      UK: "🇬🇧",
      JP: "🇯🇵",
      CA: "🇨🇦",
      AU: "🇦🇺"
    };
    return countryCodeMap[countryCode] || "🏳️";
  };

  // 根据国家选择卡片边框效果颜色
  const getBorderColor = (countryCode: Country) => {
    const colorMap: Record<Country, string> = {
      CN: "border-red-500/30 hover:border-red-500/70 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]",
      US: "border-blue-500/30 hover:border-blue-500/70 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]",
      UK: "border-blue-700/30 hover:border-blue-700/70 hover:shadow-[0_0_15px_rgba(29,78,216,0.3)]",
      JP: "border-rose-500/30 hover:border-rose-500/70 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]",
      CA: "border-red-600/30 hover:border-red-600/70 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]",
      AU: "border-yellow-500/30 hover:border-yellow-500/70 hover:shadow-[0_0_15px_rgba(234,179,8,0.3)]"
    };
    return colorMap[countryCode] || "border-gray-500/30 hover:border-gray-500/70";
  };

  // 列表布局时使用紧凑模式
  if (viewMode === "list") {
    return (
      <Card
        className={cn(
          "w-full overflow-hidden transition-all duration-300 border-2",
          getBorderColor(identity.country),
          isHovered ? "bg-gradient-to-r from-background to-background/70" : ""
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center p-4">
          {identity.avatar_url ? (
            <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-primary/20 relative mr-4 flex-shrink-0">
              <Image
                src={identity.avatar_url}
                alt={identity.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ) : (
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
              <UserCircle2 className="h-8 w-8 text-primary/60" />
            </div>
          )}

          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium text-lg">{identity.name}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <UserCircle2 className="w-3.5 h-3.5 mr-1" />
                    {identity.gender || '未知'}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {age}岁
                  </span>
                  <span className="flex items-center">
                    <Flag className="w-3.5 h-3.5 mr-1" />
                    <span className="mr-1">{getFlagEmoji(identity.country)}</span>
                    {COUNTRY_INFO[identity.country]?.name || "未知"}
                  </span>
                </div>
              </div>

              {showActions && (
                <div className="flex items-center gap-2">
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
                  <Link href={`/protected/identities/${identity.id}`} passHref>
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="查看详情">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    title="删除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {identity.occupation && (
              <div className="mt-2">
                <Badge variant="outline" className="text-xs bg-muted/30">
                  <Briefcase className="w-3 h-3 mr-1" />
                  {identity.occupation}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // 网格布局时使用完整卡片
  return (
    <Card
      className={cn(
        "w-full overflow-hidden relative transition-all duration-500 h-full flex flex-col border-2",
        getBorderColor(identity.country),
        isFavorite ? "shadow-neon" : "",
        isHovered ? "translate-y-[-4px]" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 收藏标记 */}
      {isFavorite && (
        <div className="absolute top-0 right-0 z-10 w-16 h-16 overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-br from-yellow-300 to-yellow-500 w-20 h-20 -rotate-45 transform origin-top-right"></div>
          <Star className="absolute top-3 right-3 h-4 w-4 text-white animate-pulse-neon" />
        </div>
      )}

      {/* 头像显示 */}
      {identity.avatar_url && (
        <div className="w-full h-48 bg-gradient-to-b from-muted/50 to-muted relative overflow-hidden group">
          <Image
            src={identity.avatar_url}
            alt={identity.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background opacity-80"></div>

          {/* 霓虹边框效果 */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent"></div>
            <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-cyber-blue to-transparent"></div>
            <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-cyber-blue to-transparent"></div>
          </div>
        </div>
      )}

      <CardHeader className={cn(
        "pb-2",
        identity.avatar_url ? "relative z-10" : "",
        identity.avatar_url ? "-mt-10" : ""
      )}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center">
              <User className={cn(
                "w-4 h-4 mr-2",
                isHovered ? "text-cyber-blue animate-pulse-neon" : "text-primary"
              )} />
              <CardTitle className={cn(
                "text-xl leading-tight",
                isHovered ? "text-white font-semibold" : ""
              )}>
                {identity.name}
              </CardTitle>
            </div>

            <div className="flex items-center gap-4 flex-wrap mt-1">
              <CardDescription className="flex items-center">
                <UserCircle2 className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                <span>{identity.gender || '未知'}</span>
              </CardDescription>

              <CardDescription className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                <span>{new Date(identity.birth_date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' })}</span>
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
              className={cn(
                "h-8 w-8 transition-all duration-300",
                isHovered ? "bg-muted/50" : ""
              )}
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
            <Badge variant="outline" className={cn(
              "flex items-center text-xs gap-1 bg-muted/30 transition-all duration-300",
              isHovered ? "bg-muted/50 border-primary/30" : ""
            )}>
              <Briefcase className="w-3 h-3" />
              {identity.occupation}
            </Badge>
          )}

          {identity.education && (
            <Badge variant="outline" className={cn(
              "flex items-center text-xs gap-1 bg-muted/30 transition-all duration-300",
              isHovered ? "bg-muted/50 border-primary/30" : ""
            )}>
              <GraduationCap className="w-3 h-3" />
              {identity.education}
            </Badge>
          )}

          {identity.tags && identity.tags.length > 0 && identity.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className={cn(
              "flex items-center text-xs gap-1 bg-muted/30 transition-all duration-300",
              isHovered ? "bg-muted/50 border-primary/30" : ""
            )}>
              <Tag className="w-3 h-3" />
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-3 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* 身份证号 */}
          <div className="group space-y-1 relative">
            <p className="text-xs text-muted-foreground flex items-center">
              <Fingerprint className="w-3 h-3 mr-1" />
              {COUNTRY_INFO[identity.country]?.idNumberName || "身份证号"}：
            </p>
            <p className="text-sm truncate pr-6">
              {identity.id_number}
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 absolute right-0 top-4 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(
                  identity.id_number,
                  `${COUNTRY_INFO[identity.country]?.idNumberName || "身份证号"} 已复制到剪贴板`
                )}
                title="复制"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </p>
          </div>

          {/* 联系信息 - 电话号码 */}
          <div className="group space-y-1 relative">
            <p className="text-xs text-muted-foreground flex items-center">
              <Phone className="w-3 h-3 mr-1" />
              电话：
            </p>
            <p className="text-sm truncate pr-6">
              {identity.phone}
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 absolute right-0 top-4 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(identity.phone, "电话号码已复制到剪贴板")}
                title="复制"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </p>
          </div>

          {/* 联系信息 - 邮件地址 */}
          <div className="group space-y-1 relative">
            <p className="text-xs text-muted-foreground flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              邮箱：
            </p>
            <p className="text-sm truncate pr-6">
              {identity.email}
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 absolute right-0 top-4 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(identity.email, "邮箱地址已复制到剪贴板")}
                title="复制"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </p>
          </div>

          {/* 地址 */}
          <div className="group space-y-1 relative">
            <p className="text-xs text-muted-foreground flex items-center">
              <Home className="w-3 h-3 mr-1" />
              地址：
            </p>
            <p className="text-sm truncate pr-6">
              {identity.address}
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 absolute right-0 top-4 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(identity.address, "地址已复制到剪贴板")}
                title="复制"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </p>
          </div>

          {/* 驾照 */}
          {identity.drivers_license && (
            <div className="group space-y-1 relative">
              <p className="text-xs text-muted-foreground flex items-center">
                <Car className="w-3 h-3 mr-1" />
                驾照：
              </p>
              <p className="text-sm truncate pr-6">
                {identity.drivers_license}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 absolute right-0 top-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => copyToClipboard(
                    identity.drivers_license || "",
                    "驾照号码已复制到剪贴板"
                  )}
                  title="复制"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </p>
            </div>
          )}

          {/* 护照 */}
          {identity.passport_number && (
            <div className="group space-y-1 relative">
              <p className="text-xs text-muted-foreground flex items-center">
                <Globe className="w-3 h-3 mr-1" />
                护照：
              </p>
              <p className="text-sm truncate pr-6">
                {identity.passport_number}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 absolute right-0 top-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => copyToClipboard(
                    identity.passport_number || "",
                    "护照号码已复制到剪贴板"
                  )}
                  title="复制"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </p>
            </div>
          )}
        </div>

        {/* 信用卡信息 */}
        {identity.credit_card && (
          <div className="mt-3 p-2 border rounded-md bg-muted/20 space-y-1 relative group">
            <div className="flex items-center justify-between">
              <h4 className="text-xs flex items-center font-medium">
                <CreditCard className="w-3 h-3 mr-1 text-primary" />
                信用卡
              </h4>
              <p className="text-xs">{identity.credit_card.type}</p>
            </div>
            <p className="text-sm font-mono">{identity.credit_card.number}</p>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>有效期：{identity.credit_card.expiration}</span>
              <span>CVV：{identity.credit_card.cvv}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => copyToClipboard(
                `卡号: ${identity.credit_card?.number}\n有效期: ${identity.credit_card?.expiration}\nCVV: ${identity.credit_card?.cvv}`,
                "信用卡信息已复制到剪贴板"
              )}
              title="复制信用卡信息"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 mt-auto">
        <div className="flex justify-between w-full">
          {/* 社交媒体图标 */}
          <div className="flex gap-1">
            {identity.social_media && identity.social_media.length > 0 && (
              identity.social_media.slice(0, 3).map((social, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-muted/30 h-8 w-8 flex items-center justify-center p-0"
                >
                  <Network className="h-4 w-4" />
                </Badge>
              ))
            )}
          </div>

          {/* 操作按钮 */}
          {showActions && (
            <div className="flex gap-2">
              <Link href={`/protected/identities/${identity.id}`} passHref>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "text-xs h-8 transition-all duration-300",
                    isHovered ? "bg-primary text-primary-foreground border-primary" : ""
                  )}
                >
                  <Eye className="mr-1 h-3 w-3" />
                  查看详情
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
} 
