-- 添加country列到identities表
ALTER TABLE identities ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'CN' NOT NULL;

-- 添加notes列到identities表 (用于存储备注)
ALTER TABLE identities ADD COLUMN IF NOT EXISTS notes TEXT;

-- 添加tags列到identities表 (使用数组存储多个标签)
ALTER TABLE identities ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'::TEXT[]; 
