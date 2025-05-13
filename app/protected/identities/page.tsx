import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import IdentityGeneratorForm from "@/components/identity/identity-generator-form";
import IdentityList from "@/components/identity/identity-list";
import { getSavedIdentities } from "@/app/actions/identity-actions";
import { COUNTRY_INFO } from "@/lib/country-configs";
import { Country } from "@/lib/types";
import FilterableIdentityList from "@/components/identity/filterable-identity-list";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "虚拟身份管理 | FauxID",
  description: "生成和管理虚拟身份信息",
};

export default async function IdentitiesPage() {
  // 创建 Supabase 客户端
  const supabase = await createClient();

  // 验证用户是否已登录
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-4">需要登录</h1>
        <p className="text-muted-foreground">请登录后访问此页面</p>
      </div>
    );
  }

  // 获取用户保存的身份列表
  const { success, data: identities = [], error } = await getSavedIdentities();

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">虚拟身份管理</h1>
            <p className="text-muted-foreground">生成和管理您的虚拟身份信息</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(COUNTRY_INFO).map((country) => (
              <Badge key={country} variant="outline" className="bg-primary/5">
                {COUNTRY_INFO[country as Country].name}
              </Badge>
            ))}
          </div>
        </div>
        <div className="bg-accent/30 text-sm p-4 rounded-xl text-foreground flex gap-3 items-start border border-accent mb-6">
          <InfoIcon size="18" className="mt-0.5 text-primary flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">支持多国身份</p>
            <p className="text-muted-foreground text-xs">现已支持多国身份信息生成，包括姓名、地址、身份证号和职业等完整信息</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="manage" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="manage">身份管理</TabsTrigger>
          <TabsTrigger value="generate">生成新身份</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="mt-0">
          <div className="bg-card border border-border/50 rounded-xl p-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">我的身份列表</h2>
                <Badge variant="outline">{identities.length} 个身份</Badge>
              </div>

              {error ? (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-md">
                  加载身份列表失败: {error}
                </div>
              ) : (
                <FilterableIdentityList
                  key={identities.length}
                  identities={identities}
                />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="generate" className="mt-0">
          <div className="bg-card border border-border/50 rounded-xl p-6">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">生成新身份</h2>
              <p className="text-muted-foreground mb-6">使用下面的表单定制并生成新的虚拟身份信息</p>
              <IdentityGeneratorForm />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
