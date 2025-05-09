"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { generateIdentity, generateMultipleIdentitiesAction } from "@/app/actions/identity-actions";
import { IdentityType, Gender, Country } from "@/lib/types";
import { COUNTRY_INFO, US_STATES } from "@/lib/country-configs";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface IdentityGeneratorFormProps {
  onGenerate?: (identities: IdentityType[]) => void;
}

export default function IdentityGeneratorForm({ onGenerate }: IdentityGeneratorFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [useMultiple, setUseMultiple] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country>("CN");
  const [generateAvatar, setGenerateAvatar] = useState(true);
  const [generateCreditCard, setGenerateCreditCard] = useState(true);
  const [generateSocialMedia, setGenerateSocialMedia] = useState(true);
  const { toast } = useToast();

  // 区域选项
  const regionOptions = [
    "北京", "上海", "广州", "深圳", "杭州", "南京", "成都", "重庆",
    "武汉", "西安", "天津", "苏州", "郑州", "长沙", "青岛"
  ];

  async function handleSubmit(formData: FormData) {
    setIsGenerating(true);
    setError(null);

    try {
      // 为调试添加一些额外的参数到表单中
      formData.append("generate_avatar", generateAvatar.toString());
      formData.append("generate_credit_card", generateCreditCard.toString());
      formData.append("generate_social_media", generateSocialMedia.toString());

      let result;

      if (useMultiple) {
        const count = parseInt(formData.get("count") as string || "5");
        toast({
          title: "正在生成虚拟身份",
          description: `正在生成 ${count} 个虚拟身份，请稍候...`,
        });

        result = await generateMultipleIdentitiesAction(formData);
        if (Array.isArray(result)) {
          // 成功生成多个身份
          toast({
            title: "生成成功",
            description: `已成功生成 ${result.length} 个虚拟身份`,
          });

          if (onGenerate) {
            onGenerate(result);
          }
          window.location.reload(); // 强制刷新页面以显示新生成的身份
        } else {
          // 处理可能的错误对象
          const errorMessage = typeof result === 'object' && result !== null && 'error' in result
            ? String((result as any).error)
            : "未知错误";
          setError(`生成身份时出错: ${errorMessage}`);
          console.error("生成多个身份失败:", result);

          toast({
            title: "生成失败",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "正在生成虚拟身份",
          description: "正在生成虚拟身份，请稍候...",
        });

        result = await generateIdentity(formData);
        if (result && typeof result === 'object' && 'id' in result) {
          // 成功生成单个身份
          toast({
            title: "生成成功",
            description: `已成功生成身份: ${result.name}`,
          });

          if (onGenerate) {
            onGenerate([result]);
          }
          window.location.reload(); // 强制刷新页面以显示新生成的身份
        } else {
          // 处理可能的错误对象
          const errorMessage = typeof result === 'object' && result !== null && 'error' in result
            ? String((result as any).error)
            : "未知错误";
          setError(`生成身份时出错: ${errorMessage}`);
          console.error("生成单个身份失败:", result);

          toast({
            title: "生成失败",
            description: errorMessage,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("生成身份时发生异常:", error);
      setError(`生成身份时发生错误: ${error instanceof Error ? error.message : String(error)}`);

      toast({
        title: "生成失败",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>生成虚拟身份</CardTitle>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          {/* 选择国家 */}
          <div className="space-y-2">
            <Label htmlFor="country">国家</Label>
            <Select
              name="country"
              defaultValue="CN"
              onValueChange={(value) => setSelectedCountry(value as Country)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择国家" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(COUNTRY_INFO).map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 性别选择 */}
          <div className="space-y-2">
            <Label htmlFor="gender">性别</Label>
            <Select name="gender">
              <SelectTrigger>
                <SelectValue placeholder="选择性别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="random">随机</SelectItem>
                <SelectItem value="男">男</SelectItem>
                <SelectItem value="女">女</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 地区选择 - 中国 */}
          {selectedCountry === "CN" && (
            <div className="space-y-2">
              <Label htmlFor="region">地区</Label>
              <Select name="region">
                <SelectTrigger>
                  <SelectValue placeholder="选择地区 (中国)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">随机</SelectItem>
                  {regionOptions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">仅在选择中国时有效</p>
            </div>
          )}

          {/* 州选择 - 美国 */}
          {selectedCountry === "US" && (
            <div className="space-y-2">
              <Label htmlFor="region">州</Label>
              <Select name="region">
                <SelectTrigger>
                  <SelectValue placeholder="选择州 (美国)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">随机</SelectItem>
                  {US_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 年龄范围 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age_min">最小年龄</Label>
              <Input
                type="number"
                id="age_min"
                name="age_min"
                placeholder="18"
                min="1"
                max="99"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age_max">最大年龄</Label>
              <Input
                type="number"
                id="age_max"
                name="age_max"
                placeholder="70"
                min="1"
                max="99"
              />
            </div>
          </div>

          {/* 美国特定选项 */}
          {selectedCountry === "US" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="occupation_category">职业类别</Label>
                <Select name="occupation_category">
                  <SelectTrigger>
                    <SelectValue placeholder="选择职业类别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="random">随机</SelectItem>
                    <SelectItem value="management">管理</SelectItem>
                    <SelectItem value="business">商业</SelectItem>
                    <SelectItem value="technology">技术</SelectItem>
                    <SelectItem value="healthcare">医疗</SelectItem>
                    <SelectItem value="education">教育</SelectItem>
                    <SelectItem value="legal">法律</SelectItem>
                    <SelectItem value="service">服务</SelectItem>
                    <SelectItem value="construction">建筑</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education_level">教育水平</Label>
                <Select name="education_level">
                  <SelectTrigger>
                    <SelectValue placeholder="选择教育水平" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="random">随机</SelectItem>
                    <SelectItem value="high_school">高中</SelectItem>
                    <SelectItem value="associates">副学士</SelectItem>
                    <SelectItem value="bachelors">学士</SelectItem>
                    <SelectItem value="masters">硕士</SelectItem>
                    <SelectItem value="doctorate">博士</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* 批量生成选项 */}
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="use-multiple"
              checked={useMultiple}
              onCheckedChange={(checked) => setUseMultiple(checked === true)}
            />
            <Label
              htmlFor="use-multiple"
              className="text-sm font-normal cursor-pointer"
            >
              批量生成
            </Label>
          </div>

          {/* 批量生成数量 */}
          {useMultiple && (
            <div className="space-y-2">
              <Label htmlFor="count">数量</Label>
              <Input
                type="number"
                id="count"
                name="count"
                placeholder="5"
                min="1"
                max="50"
              />
              <p className="text-xs text-muted-foreground">
                最多可批量生成 50 个身份
              </p>
            </div>
          )}

          {/* 新增选项 */}
          <div className="space-y-2">
            <Label>附加信息</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="generate-avatar"
                  checked={generateAvatar}
                  onCheckedChange={(checked) => setGenerateAvatar(checked as boolean)}
                />
                <Label htmlFor="generate-avatar" className="cursor-pointer">生成头像</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="generate-credit-card"
                  checked={generateCreditCard}
                  onCheckedChange={(checked) => setGenerateCreditCard(checked as boolean)}
                />
                <Label htmlFor="generate-credit-card" className="cursor-pointer">生成信用卡信息</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="generate-social-media"
                  checked={generateSocialMedia}
                  onCheckedChange={(checked) => setGenerateSocialMedia(checked as boolean)}
                />
                <Label htmlFor="generate-social-media" className="cursor-pointer">生成社交媒体账号</Label>
              </div>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-2 rounded">
              {error}
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button
            className="w-full"
            type="submit"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                生成中...
              </>
            ) : (
              <>生成身份</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 
