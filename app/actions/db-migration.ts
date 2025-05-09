"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addMissingColumns() {
  try {
    const supabase = await createClient();
    
    // 添加nationality列
    const { error: nationalityError } = await supabase
      .rpc("alter_table_add_column", {
        table_name: "identities",
        column_name: "nationality",
        column_type: "TEXT" 
      });
    
    if (nationalityError) {
      console.error("添加nationality列失败:", nationalityError);
      return { success: false, error: nationalityError.message };
    }
    
    // 添加passport_number列
    const { error: passportError } = await supabase
      .rpc("alter_table_add_column", {
        table_name: "identities",
        column_name: "passport_number",
        column_type: "TEXT" 
      });
    
    if (passportError) {
      console.error("添加passport_number列失败:", passportError);
      return { success: false, error: passportError.message };
    }
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("执行数据库迁移时出错:", error);
    return { success: false, error: "执行数据库迁移时发生错误" };
  }
} 
