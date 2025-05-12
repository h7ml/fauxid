"use client";

import { useState, useRef, useEffect } from "react";
import { IdentityType, Country } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { COUNTRY_INFO } from "@/lib/country-configs";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  toggleFavorite,
  deleteIdentity,
  updateNotes,
  updateTags,
  addTag,
  removeTag
} from "@/app/actions/identity-actions";
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
  Save,
  Book,
  Flag,
  BookOpen,
  Car,
  CreditCard,
  Globe,
  Copy
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { safeCopyToClipboard } from "@/utils/clipboard";

interface IdentityDetailProps {
  identity: IdentityType;
}

export default function IdentityDetail({ identity }: IdentityDetailProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(identity.favorite || false);
  const [notes, setNotes] = useState(identity.notes || "");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState<string[]>(identity.tags || []);
  const notesTextareaRef = useRef<HTMLTextAreaElement>(null);

  // 计算年龄
  const birthYear = new Date(identity.birth_date).getFullYear();
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  // 根据国家设置不同的日期格式
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const dateLocale = identity.country === 'US' ? 'en-US' : 'zh-CN';
  const formattedBirthDate = new Date(identity.birth_date).toLocaleDateString(dateLocale, dateOptions);

  // 当切换为编辑备注模式时，自动聚焦文本框
  useEffect(() => {
    if (isEditingNotes && notesTextareaRef.current) {
      notesTextareaRef.current.focus();
    }
  }, [isEditingNotes]);

  async function handleToggleFavorite() {
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("id", identity.id);
      formData.append("favorite", isFavorite.toString());

      const result = await toggleFavorite(formData);

      if (result.success) {
        setIsFavorite(!isFavorite);
        toast({
          title: isFavorite ? "已取消收藏" : "已加入收藏",
          description: `${identity.name} ${isFavorite ? "已从收藏中移除" : "已添加到收藏"}`,
        });
      }
    } catch (error) {
      console.error("切换收藏状态失败:", error);
      toast({
        title: "操作失败",
        description: "切换收藏状态时出错",
        variant: "destructive",
      });
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

      if (result.success) {
        toast({
          title: "删除成功",
          description: `身份 "${identity.name}" 已被删除`,
        });
        router.push("/protected/identities");
      }
    } catch (error) {
      console.error("删除身份信息失败:", error);
      toast({
        title: "删除失败",
        description: "删除身份信息时出错",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleSaveNotes() {
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("id", identity.id);
      formData.append("notes", notes);

      const result = await updateNotes(formData);

      if (result.success) {
        setIsEditingNotes(false);
        toast({
          title: "保存成功",
          description: "备注已更新",
        });
      }
    } catch (error) {
      console.error("保存备注失败:", error);
      toast({
        title: "保存失败",
        description: "保存备注时出错",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleAddTag() {
    if (!newTag.trim()) return;

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("id", identity.id);
      formData.append("tag", newTag.trim());

      const result = await addTag(formData);

      if (result.success) {
        // 只有当标签不存在时才添加
        if (!tags.includes(newTag.trim())) {
          setTags([...tags, newTag.trim()]);
          toast({
            title: "添加成功",
            description: `标签 "${newTag.trim()}" 已添加`,
          });
        }
        setNewTag("");
      }
    } catch (error) {
      console.error("添加标签失败:", error);
      toast({
        title: "添加失败",
        description: "添加标签时出错",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleRemoveTag(tagToRemove: string) {
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("id", identity.id);
      formData.append("tag", tagToRemove);

      const result = await removeTag(formData);

      if (result.success) {
        setTags(tags.filter(tag => tag !== tagToRemove));
        toast({
          title: "删除成功",
          description: `标签 "${tagToRemove}" 已删除`,
        });
      }
    } catch (error) {
      console.error("删除标签失败:", error);
      toast({
        title: "删除失败",
        description: "删除标签时出错",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  // 复制文本并显示提示
  async function copyToClipboard(text: string, description: string) {
    const success = await safeCopyToClipboard(text);
    if (success) {
      toast({
        title: "复制成功",
        description: description,
      });
    } else {
      toast({
        title: "复制失败",
        description: "无法访问剪贴板",
        variant: "destructive",
      });
    }
  }

  // 获取国家信息
  const countryInfo = COUNTRY_INFO[identity.country as Country] || COUNTRY_INFO.CN;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2 overflow-hidden">
          {/* 显示头像（如果有） */}
          {identity.avatar_url && (
            <div className="w-full h-64 bg-muted relative overflow-hidden">
              <Image
                src={identity.avatar_url}
                alt={identity.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}

          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{identity.name}</CardTitle>
                <CardDescription className="text-base mt-1">
                  {age}岁 | {identity.gender} | {identity.occupation || "未知职业"}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-base">
                {COUNTRY_INFO[identity.country as Country]?.name || "未知国家"}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="basic" className="col-span-2">
          <TabsList className="grid grid-cols-3 md:w-[400px]">
            <TabsTrigger value="basic">基本信息</TabsTrigger>
            <TabsTrigger value="contact">联系方式</TabsTrigger>
            <TabsTrigger value="additional">额外信息</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">姓名</div>
                    <div className="font-medium">{identity.name}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">性别</div>
                    <div className="font-medium">{identity.gender}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">出生日期</div>
                    <div className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formattedBirthDate} ({age}岁)
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">职业</div>
                    <div className="font-medium">{identity.occupation || "未知"}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">教育程度</div>
                    <div className="font-medium flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      {identity.education || "未知"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">国籍</div>
                    <div className="font-medium flex items-center gap-2">
                      <Flag className="h-4 w-4" />
                      {identity.nationality || COUNTRY_INFO[identity.country as Country]?.name || "未知"}
                    </div>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <div className="text-sm text-muted-foreground">
                      {COUNTRY_INFO[identity.country as Country]?.idNumberName || "身份证号"}
                    </div>
                    <div className="font-medium flex items-center gap-2">
                      <Fingerprint className="h-4 w-4" />
                      {identity.id_number}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1"
                        onClick={() => copyToClipboard(identity.id_number, "身份证号已复制到剪贴板")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {identity.passport_number && (
                    <div className="space-y-1 col-span-2">
                      <div className="text-sm text-muted-foreground">护照号码</div>
                      <div className="font-medium flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {identity.passport_number}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-1"
                          onClick={() => copyToClipboard(identity.passport_number || "", "护照号码已复制到剪贴板")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {identity.drivers_license && (
                    <div className="space-y-1 col-span-2">
                      <div className="text-sm text-muted-foreground">驾照号码</div>
                      <div className="font-medium flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        {identity.drivers_license}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-1"
                          onClick={() => copyToClipboard(identity.drivers_license || "", "驾照号码已复制到剪贴板")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>联系方式</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-2">
                    <div className="text-sm text-muted-foreground">家庭住址</div>
                    <div className="font-medium flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      {identity.address}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1"
                        onClick={() => copyToClipboard(identity.address, "地址已复制到剪贴板")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">电话号码</div>
                    <div className="font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {identity.phone}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1"
                        onClick={() => copyToClipboard(identity.phone, "电话号码已复制到剪贴板")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">电子邮箱</div>
                    <div className="font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {identity.email}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1"
                        onClick={() => copyToClipboard(identity.email, "邮箱地址已复制到剪贴板")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {identity.social_media && identity.social_media.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      社交媒体账号
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {identity.social_media.map((account, index) => (
                        <div key={index} className="space-y-1">
                          <div className="text-sm text-muted-foreground">{account.platform}</div>
                          <div className="font-medium">
                            {account.username}
                            {account.url && (
                              <Button
                                variant="link"
                                className="p-0 h-auto ml-2"
                                onClick={() => {
                                  if (account.url) {
                                    window.open(account.url, '_blank');
                                  }
                                }}
                              >
                                访问
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="additional" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>额外信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {identity.credit_card && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      信用卡信息
                    </div>
                    <div className="bg-muted p-4 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">卡类型</div>
                          <div className="font-medium">{identity.credit_card.type}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">有效期</div>
                          <div className="font-medium">{identity.credit_card.expiration}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">卡号</div>
                          <div className="font-medium flex items-center gap-2">
                            {identity.credit_card.number}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-1"
                              onClick={() => copyToClipboard(identity.credit_card?.number || "", "信用卡号已复制到剪贴板")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">CVV</div>
                          <div className="font-medium flex items-center gap-2">
                            {identity.credit_card.cvv}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-1"
                              onClick={() => copyToClipboard(identity.credit_card?.cvv || "", "CVV码已复制到剪贴板")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {identity.tags && identity.tags.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      标签
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {identity.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    备注
                  </div>
                  <Textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="min-h-[100px]"
                    placeholder="添加备注..."
                  />
                  <Button
                    className="mt-2"
                    size="sm"
                    onClick={handleSaveNotes}
                    disabled={isProcessing}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isProcessing ? "保存中..." : "保存备注"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>危险操作</CardTitle>
          <CardDescription>
            这些操作不可撤销，请谨慎使用。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isProcessing}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isProcessing ? "删除中..." : "删除此身份"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 
