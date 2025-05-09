import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import IdentityGeneratorForm from "@/components/identity/identity-generator-form";
import IdentityList from "@/components/identity/identity-list";
import { getSavedIdentities } from "@/app/actions/identity-actions";
import { COUNTRY_INFO } from "@/lib/country-configs";
import FilterableIdentityList from "@/components/identity/filterable-identity-list";

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
    <div className="container max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">虚拟身份管理</h1>
        <p className="text-muted-foreground">生成和管理您的虚拟身份信息</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <IdentityGeneratorForm />
        </div>

        <div className="lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4">我的身份列表</h2>

          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
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
    </div>
  );
} 
