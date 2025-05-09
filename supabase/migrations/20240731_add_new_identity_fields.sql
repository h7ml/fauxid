-- 添加驾照号码字段
ALTER TABLE identities
ADD COLUMN IF NOT EXISTS drivers_license text;

-- 添加信用卡信息字段 (使用JSONB类型存储复杂结构)
ALTER TABLE identities
ADD COLUMN IF NOT EXISTS credit_card jsonb;

-- 添加社交媒体账号字段 (使用JSONB数组类型存储多个账号)
ALTER TABLE identities
ADD COLUMN IF NOT EXISTS social_media jsonb[];

-- 添加头像URL字段
ALTER TABLE identities
ADD COLUMN IF NOT EXISTS avatar_url text;

-- 创建RLS策略，确保只有所有者可以访问这些新字段
ALTER TABLE identities ENABLE ROW LEVEL SECURITY;

-- 刷新现有RLS策略
DROP POLICY IF EXISTS "用户可以查看自己的身份信息" ON identities;
DROP POLICY IF EXISTS "用户可以创建自己的身份信息" ON identities;
DROP POLICY IF EXISTS "用户可以更新自己的身份信息" ON identities;
DROP POLICY IF EXISTS "用户可以删除自己的身份信息" ON identities;

-- 重新创建RLS策略
CREATE POLICY "用户可以查看自己的身份信息" ON identities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "用户可以创建自己的身份信息" ON identities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的身份信息" ON identities
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的身份信息" ON identities
    FOR DELETE USING (auth.uid() = user_id); 
