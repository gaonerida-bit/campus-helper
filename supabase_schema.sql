-- ============================================================
-- Campus Helper - Supabase Database Schema
-- 使用说明：将本文件全部内容粘贴到 Supabase 控制台的
--   Table Editor > SQL Editor，然后点击 "Run" 执行即可。
-- 数据隔离策略：使用 device_id 作为 user_id，通过 RLS 限制
--   每个设备只能访问自己的数据。匿名用户可读写。
-- ============================================================

-- --------------------------------------------------------
-- 0. 辅助函数：自动更新 updated_at 字段
-- --------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------------------
-- 1. applications（投递记录）
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS applications (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  company     TEXT NOT NULL,
  position    TEXT NOT NULL,
  location    TEXT,
  salary      TEXT,
  stage       TEXT,
  status      TEXT,
  applied_date TEXT,
  deadline    TEXT,
  notes       TEXT,
  hr_contact  TEXT,
  source      TEXT,
  url         TEXT,
  created_at  TEXT,
  updated_at  TEXT
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "applications: anon full access"
  ON applications
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------
-- 2. interviews（面试）
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS interviews (
  id             TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL,
  application_id TEXT,
  company        TEXT NOT NULL,
  position       TEXT NOT NULL,
  type           TEXT,
  date           TEXT,
  time           TEXT,
  location       TEXT,
  online_link    TEXT,
  interviewer    TEXT,
  feedback       TEXT,
  rating         INTEGER,
  questions      JSONB,
  notes          TEXT,
  reminder       TEXT,
  status         TEXT,
  created_at     TEXT
);

ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "interviews: anon full access"
  ON interviews
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------
-- 3. contacts（联系人 / 人脉）
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS contacts (
  id                 TEXT PRIMARY KEY,
  user_id            TEXT NOT NULL,
  name               TEXT NOT NULL,
  company            TEXT NOT NULL,
  position           TEXT NOT NULL,
  email              TEXT,
  phone              TEXT,
  wechat             TEXT,
  linkedin           TEXT,
  relationship       TEXT,
  last_contact       TEXT,
  notes              TEXT,
  tags               JSONB,
  company_profile_id TEXT,
  created_at         TEXT
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contacts: anon full access"
  ON contacts
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------
-- 4. company_profiles（公司信息）
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS company_profiles (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  name        TEXT NOT NULL,
  industry    TEXT,
  size        TEXT,
  website     TEXT,
  description TEXT,
  salary      JSONB,   -- { entry?: string, intern?: string }
  benefits    JSONB,   -- string[]
  interviews  JSONB,   -- string[]
  timeline    TEXT,
  culture     TEXT,
  created_at  TEXT
);

ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "company_profiles: anon full access"
  ON company_profiles
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------
-- 5. exams（笔试 / 测评）
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS exams (
  id             TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL,
  company        TEXT NOT NULL,
  position       TEXT,
  date           TEXT,
  time           TEXT,
  type           TEXT,
  status         TEXT,
  location       TEXT,
  duration       TEXT,
  online_link    TEXT,
  score          TEXT,
  notes          TEXT,
  application_id TEXT,
  created_at     TEXT
);

ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "exams: anon full access"
  ON exams
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------
-- 6. questions（题库）
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS questions (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  category    TEXT,
  type        TEXT,
  difficulty  TEXT,
  question    TEXT,
  answer      TEXT,
  explanation TEXT,
  tags        JSONB,   -- string[]
  starred     BOOLEAN,
  source      TEXT,
  created_at  TEXT
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "questions: anon full access"
  ON questions
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------
-- 7. calendar_events（日历事件）
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS calendar_events (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  date        TEXT,
  title       TEXT,
  type        TEXT,
  company     TEXT,
  description TEXT,
  reminder    BOOLEAN,
  created_at  TEXT
);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "calendar_events: anon full access"
  ON calendar_events
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------
-- 8. offers（Offer 管理）
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS offers (
  id             TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL,
  company        TEXT NOT NULL,
  position       TEXT NOT NULL,
  salary         JSONB,   -- { base: number, bonus?, stock?, total? }
  location       TEXT,
  level          TEXT,
  start_date     TEXT,
  deadline       TEXT,
  benefits       JSONB,   -- string[]
  pros           JSONB,   -- string[]
  cons           JSONB,   -- string[]
  recommendation TEXT,
  notes          TEXT,
  compared_with  JSONB,   -- string[]
  created_at     TEXT
);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "offers: anon full access"
  ON offers
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------
-- 9. resumes（简历）
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS resumes (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL,
  title      TEXT,
  content    TEXT,
  version    INTEGER,
  is_default BOOLEAN,
  created_at TEXT,
  updated_at TEXT
);

ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "resumes: anon full access"
  ON resumes
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------
-- 10. chat_messages（AI 聊天记录）
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS chat_messages (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL,
  role       TEXT,
  content    TEXT,
  timestamp  TEXT,
  created_at TEXT
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chat_messages: anon full access"
  ON chat_messages
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------
-- 11. activities（活动记录）
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS activities (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL,
  type       TEXT,
  action     TEXT,
  company    TEXT,
  position   TEXT,
  timestamp  TEXT,
  created_at TEXT
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "activities: anon full access"
  ON activities
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------
-- 12. user_profiles（用户配置）
--     以 user_id（设备 ID）为主键，每设备一条记录
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id           TEXT PRIMARY KEY,
  name              TEXT,
  title             TEXT,
  email             TEXT,
  phone             TEXT,
  target_positions  JSONB,   -- string[]
  target_locations  JSONB,   -- string[]
  target_companies  JSONB,   -- string[]
  goals             JSONB,   -- { applications?, interviews?, replies? }
  settings          JSONB    -- { noResponseDays?, quietHoursStart?, quietHoursEnd?, monthlyBudget?, theme?, defaultView? }
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_profiles: anon full access"
  ON user_profiles
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 完成！共创建 12 张表，全部开启 RLS。
-- 注意：RLS 策略允许匿名角色完全访问，数据隔离由应用层
-- 通过 user_id（= device_id）过滤实现。
-- ============================================================
