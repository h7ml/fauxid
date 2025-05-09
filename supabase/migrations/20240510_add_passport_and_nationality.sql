-- 添加nationality列到identities表
ALTER TABLE identities ADD COLUMN IF NOT EXISTS nationality TEXT;

-- 添加passport_number列到identities表
ALTER TABLE identities ADD COLUMN IF NOT EXISTS passport_number TEXT; 
