"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { generateIdentity, generateMultipleIdentitiesAction } from "@/app/actions/identity-actions";
import { IdentityType, Gender, Country } from "@/lib/types";
import { COUNTRY_INFO } from "@/lib/country-configs";
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

  // 区域选项
  const regionOptions = [
    "北京", "上海", "广州", "深圳", "杭州", "南京", "成都", "重庆",
    "武汉", "西安", "天津", "苏州", "郑州", "长沙", "青岛"
  ];

  async function handleSubmit(formData: FormData) {
    setIsGenerating(true);
    setError(null);

    try {
      let result;

      if (useMultiple) {
        result = await generateMultipleIdentitiesAction(formData);
        if (result.success && onGenerate) {
          onGenerate(result.data);
        }
      } else {
        result = await generateIdentity(formData);
        // 将单个身份结果转换为数组，以便统一处理
        if (result.success && onGenerate) {
          onGenerate([result.data]);
        }
      }

      if (!result.success) {
        setError(result.error || "生成身份时出错");
      }
    } catch (error) {
      console.error("生成身份时出错:", error);
      setError("生成身份时发生错误");
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
            <Select name="country" defaultValue="CN">
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

          {/* 地区选择 */}
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
