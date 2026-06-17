-- Campus Helper Supabase Schema
-- Run this in Supabase SQL Editor to create all tables

-- ============= Applications =============
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  salary TEXT,
  stage TEXT NOT NULL DEFAULT '未投递',
  status TEXT NOT NULL DEFAULT 'pending',
  applied_date TEXT NOT NULL,
  deadline TEXT,
  notes TEXT,
  hr_contact TEXT,
  source TEXT,
  url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- ============= Interviews =============
CREATE TABLE IF NOT EXISTS interviews (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  application_id TEXT,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT '技术面',
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT,
  online_link TEXT,
  interviewer TEXT,
  feedback TEXT,
  rating INTEGER,
  questions TEXT[],
  notes TEXT,
  reminder TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming',
  created_at TEXT NOT NULL
);

-- ============= Contacts =============
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  wechat TEXT,
  linkedin TEXT,
  relationship TEXT NOT NULL DEFAULT '其他',
  last_contact TEXT,
  notes TEXT,
  tags TEXT[],
  company_profile_id TEXT,
  created_at TEXT NOT NULL
);

-- ============= Company Profiles =============
CREATE TABLE IF NOT EXISTS company_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  industry TEXT,
  size TEXT,
  website TEXT,
  description TEXT,
  salary JSONB,
  benefits TEXT[],
  interviews TEXT[],
  timeline TEXT,
  culture TEXT,
  created_at TEXT NOT NULL
);

-- ============= Exams =============
CREATE TABLE IF NOT EXISTS exams (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  company TEXT NOT NULL,
  position TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT '笔试',
  status TEXT NOT NULL DEFAULT 'upcoming',
  location TEXT,
  duration TEXT,
  online_link TEXT,
  score TEXT,
  notes TEXT,
  application_id TEXT,
  created_at TEXT NOT NULL
);

-- ============= Questions =============
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT '选择',
  difficulty TEXT NOT NULL DEFAULT 'medium',
  question TEXT NOT NULL,
  answer TEXT,
  explanation TEXT,
  tags TEXT[],
  starred BOOLEAN DEFAULT false,
  source TEXT,
  created_at TEXT NOT NULL
);

-- ============= Calendar Events =============
CREATE TABLE IF NOT EXISTS calendar_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'custom',
  company TEXT,
  description TEXT,
  reminder BOOLEAN DEFAULT false,
  created_at TEXT NOT NULL
);

-- ============= Offers =============
CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  salary JSONB NOT NULL,
  location TEXT NOT NULL,
  level TEXT,
  start_date TEXT,
  deadline TEXT,
  benefits TEXT[],
  pros TEXT[],
  cons TEXT[],
  recommendation TEXT,
  notes TEXT,
  compared_with TEXT[],
  created_at TEXT NOT NULL
);

-- ============= Resumes =============
CREATE TABLE IF NOT EXISTS resumes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  version INTEGER NOT NULL DEFAULT 1,
  is_default BOOLEAN DEFAULT false,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- ============= User Profile =============
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  email TEXT,
  phone TEXT,
  target_positions TEXT[] DEFAULT '{}',
  target_locations TEXT[] DEFAULT '{}',
  target_companies TEXT[],
  goals JSONB,
  settings JSONB
);

-- ============= Chat Messages =============
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  content TEXT NOT NULL,
  timestamp TEXT NOT NULL
);

-- ============= Activities =============
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  action TEXT NOT NULL,
  company TEXT,
  position TEXT,
  timestamp TEXT NOT NULL
);

-- ============= Indexes =============
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_company_profiles_user_id ON company_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_exams_user_id ON exams(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_user_id ON questions(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_offers_user_id ON offers(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
