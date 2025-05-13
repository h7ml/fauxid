-- 创建 notes 表
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  site_url TEXT NOT NULL,
  title TEXT NOT NULL,
  username TEXT, 
  password TEXT,
  notes TEXT,
  token TEXT,
  cookie TEXT,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  last_used_at TIMESTAMP WITH TIME ZONE
);

-- 创建基于用户ID的索引，提升查询性能
CREATE INDEX IF NOT EXISTS notes_user_id_idx ON notes (user_id);
-- 创建基于网站URL的索引，提升查询性能
CREATE INDEX IF NOT EXISTS notes_site_url_idx ON notes (site_url);

-- 添加更新触发器，用于自动更新updated_at字段
CREATE OR REPLACE FUNCTION update_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE
  ON notes
  FOR EACH ROW
  EXECUTE PROCEDURE update_notes_updated_at();

-- 启用RLS（行级安全）
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- 创建策略：只允许用户访问自己的notes
CREATE POLICY "用户可以查看自己的notes" ON notes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "用户可以创建自己的notes" ON notes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的notes" ON notes
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的notes" ON notes
  FOR DELETE
  USING (auth.uid() = user_id); 
