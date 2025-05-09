"use client";

import { useState } from "react";
import { addMissingColumns } from "@/app/actions/db-migration";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function MigrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);

  async function handleMigration() {
    setIsLoading(true);
    try {
      const res = await addMissingColumns();
      setResult(res);
    } catch (error) {
      console.error("执行迁移时出错:", error);
      setResult({ success: false, error: "执行迁移时发生错误" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>数据库迁移</CardTitle>
        </CardHeader>
        <CardContent>
          <p>这个页面用于添加缺失的数据库列：</p>
          <ul className="list-disc ml-6 mt-2">
            <li>nationality - 国籍</li>
            <li>passport_number - 护照号码</li>
          </ul>

          {result && (
            <div className={`mt-4 p-4 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {result.success ? (
                <p>迁移成功完成！</p>
              ) : (
                <p>迁移失败: {result.error}</p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleMigration} disabled={isLoading}>
            {isLoading ? "执行中..." : "执行迁移"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 
