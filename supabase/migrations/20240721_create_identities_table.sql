-- 创建身份表
CREATE TABLE IF NOT EXISTS identities (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gender TEXT NOT NULL,
  birth_date DATE NOT NULL,
  id_number TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  occupation TEXT,
  education TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  favorite BOOLEAN DEFAULT false NOT NULL
);

-- 创建基于用户ID的索引，提升查询性能
CREATE INDEX IF NOT EXISTS identities_user_id_idx ON identities (user_id);

-- 启用RLS（行级安全）
ALTER TABLE identities ENABLE ROW LEVEL SECURITY;

-- 创建策略：只允许用户访问自己的身份信息
CREATE POLICY "Users can view their own identities" ON identities
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own identities" ON identities
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own identities" ON identities
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own identities" ON identities
  FOR DELETE
  USING (auth.uid() = user_id); 
