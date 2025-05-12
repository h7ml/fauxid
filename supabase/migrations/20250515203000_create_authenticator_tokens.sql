-- 创建 authenticator_tokens 表
CREATE TABLE IF NOT EXISTS public.authenticator_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  secret TEXT NOT NULL,
  issuer TEXT,
  type TEXT DEFAULT 'totp',
  algorithm TEXT DEFAULT 'SHA1',
  digits INTEGER DEFAULT 6,
  period INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  notes TEXT
);

-- 设置 RLS 策略
ALTER TABLE public.authenticator_tokens ENABLE ROW LEVEL SECURITY;

-- 允许用户查询自己的令牌
CREATE POLICY "用户可以查看自己的认证令牌" ON public.authenticator_tokens
  FOR SELECT USING (auth.uid() = user_id);

-- 允许用户插入自己的令牌
CREATE POLICY "用户可以添加认证令牌" ON public.authenticator_tokens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 允许用户更新自己的令牌
CREATE POLICY "用户可以更新自己的认证令牌" ON public.authenticator_tokens
  FOR UPDATE USING (auth.uid() = user_id);

-- 允许用户删除自己的令牌
CREATE POLICY "用户可以删除自己的认证令牌" ON public.authenticator_tokens
  FOR DELETE USING (auth.uid() = user_id); 
