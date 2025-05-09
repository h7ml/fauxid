"use client";

import { useState, useRef, useEffect } from "react";
import { IdentityType, Country } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { COUNTRY_INFO } from "@/lib/country-configs";
import { useRouter } from "next/navigation";
import {
  toggleFavorite,
  deleteIdentity,
  updateNotes,
  updateTags,
  addTag,
  removeTag
} from "@/app/actions/identity-actions";

interface IdentityDetailProps {
  identity: IdentityType;
}

export default function IdentityDetail({ identity }: IdentityDetailProps) {
  const router = useRouter();
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

  const formattedBirthDate = new Date(identity.birth_date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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

      if (result.success) {
        router.push("/protected/identities");
      }
    } catch (error) {
      console.error("删除身份信息失败:", error);
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
      }
    } catch (error) {
      console.error("保存备注失败:", error);
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
        }
        setNewTag("");
      }
    } catch (error) {
      console.error("添加标签失败:", error);
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
      }
    } catch (error) {
      console.error("删除标签失败:", error);
    } finally {
      setIsProcessing(false);
    }
  }

  // 获取国家信息
  const countryInfo = COUNTRY_INFO[identity.country as Country] || COUNTRY_INFO.CN;

  return (
    <Card className="overflow-hidden max-w-3xl mx-auto">
      <CardHeader className="bg-primary/5">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              {identity.name}
              <Badge variant="outline">{countryInfo.name}</Badge>
            </CardTitle>
            <div className="text-muted-foreground mt-1">
              {age}岁 | {identity.gender} | {identity.occupation || "未知职业"}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            disabled={isProcessing}
            className="h-8 w-8"
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
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 gap-6">
          {/* 基本信息 */}
          <div className="grid grid-cols-1 gap-2">
            <h3 className="text-lg font-medium">基本信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex">
                <span className="font-medium w-24">{countryInfo.idNumberName}：</span>
                <span className="flex-1 break-all">{identity.id_number}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">护照号：</span>
                <span className="flex-1 break-all">{identity.passport_number || "无"}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">出生日期：</span>
                <span>{formattedBirthDate}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">国籍：</span>
                <span>{identity.nationality || countryInfo.name}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">教育程度：</span>
                <span>{identity.education || "未知"}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">联系电话：</span>
                <span>{identity.phone}</span>
              </div>
              <div className="flex md:col-span-2">
                <span className="font-medium w-24">电子邮箱：</span>
                <span className="break-all">{identity.email}</span>
              </div>
              <div className="flex md:col-span-2">
                <span className="font-medium w-24">家庭住址：</span>
                <span className="break-all">{identity.address}</span>
              </div>
            </div>
          </div>

          {/* 标签 */}
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">标签</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-2 py-1 flex items-center gap-1"
                  >
                    {tag}
                    <button
                      className="ml-1 hover:text-destructive"
                      onClick={() => handleRemoveTag(tag)}
                      disabled={isProcessing}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </Badge>
                ))
              ) : (
                <div className="text-muted-foreground text-sm">暂无标签</div>
              )}
            </div>
            <div className="flex gap-2 mt-1">
              <Input
                placeholder="添加新标签..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="max-w-[200px]"
              />
              <Button size="sm" onClick={handleAddTag} disabled={isProcessing || !newTag.trim()}>
                添加
              </Button>
            </div>
          </div>

          {/* 备注 */}
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">备注</h3>
              {!isEditingNotes && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingNotes(true)}
                >
                  编辑
                </Button>
              )}
            </div>
            {isEditingNotes ? (
              <div className="space-y-2">
                <Textarea
                  ref={notesTextareaRef}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px]"
                  placeholder="添加备注..."
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setNotes(identity.notes || "");
                      setIsEditingNotes(false);
                    }}
                    disabled={isProcessing}
                  >
                    取消
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveNotes}
                    disabled={isProcessing}
                  >
                    保存
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-muted/30 rounded-md min-h-[60px]">
                {notes ? (
                  <p className="whitespace-pre-wrap">{notes}</p>
                ) : (
                  <p className="text-muted-foreground text-sm italic">暂无备注</p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/10 py-3">
        <Button
          variant="ghost"
          onClick={() => {
            const text = `姓名：${identity.name}\n性别：${identity.gender}\n年龄：${age}岁\n${countryInfo.idNumberName}：${identity.id_number}\n出生日期：${formattedBirthDate}\n职业：${identity.occupation || "未知"}\n教育程度：${identity.education || "未知"}\n联系电话：${identity.phone}\n电子邮箱：${identity.email}\n家庭住址：${identity.address}`;
            navigator.clipboard.writeText(text);
            alert("身份信息已复制到剪贴板");
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
          复制信息
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isProcessing}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          删除身份
        </Button>
      </CardFooter>
    </Card>
  );
} 
