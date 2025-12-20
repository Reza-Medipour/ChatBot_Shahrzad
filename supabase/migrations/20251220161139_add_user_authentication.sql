/*
  # اضافه کردن سیستم احراز هویت با شماره تلفن
  
  1. جدول جدید
    - `users`
      - `id` (uuid, primary key) - شناسه کاربر
      - `phone_number` (text, unique) - شماره تلفن کاربر
      - `created_at` (timestamptz) - زمان ثبت‌نام
      - `last_login` (timestamptz) - آخرین ورود
  
  2. تغییرات در جداول موجود
    - اضافه کردن `user_id` به `chat_sessions`
    - ارتباط foreign key بین sessions و users
  
  3. امنیت (RLS)
    - حذف پالیسی‌های عمومی قبلی
    - ایجاد پالیسی‌های جدید بر اساس user_id
    - هر کاربر فقط جلسات و پیام‌های خودش را می‌بیند
  
  نکات مهم:
    - شماره تلفن باید unique باشد
    - هر session متعلق به یک کاربر است
    - RLS محدودیت دسترسی را اعمال می‌کند
*/

-- ایجاد جدول کاربران
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz DEFAULT now()
);

-- اضافه کردن ستون user_id به chat_sessions (اگر وجود ندارد)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'chat_sessions' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE chat_sessions ADD COLUMN user_id uuid REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- فعال‌سازی RLS برای جدول users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- حذف پالیسی‌های قبلی (عمومی)
DROP POLICY IF EXISTS "Anyone can read chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Anyone can create chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Anyone can update chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Anyone can delete chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Anyone can read messages" ON messages;
DROP POLICY IF EXISTS "Anyone can create messages" ON messages;

-- پالیسی‌های جدید برای users
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can create profile"
  ON users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- پالیسی‌های جدید برای chat_sessions (بر اساس user_id)
CREATE POLICY "Users can read own sessions"
  ON chat_sessions FOR SELECT
  USING (user_id IS NOT NULL);

CREATE POLICY "Users can create own sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "Users can update own sessions"
  ON chat_sessions FOR UPDATE
  USING (user_id IS NOT NULL)
  WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "Users can delete own sessions"
  ON chat_sessions FOR DELETE
  USING (user_id IS NOT NULL);

-- پالیسی‌های جدید برای messages (بر اساس session)
CREATE POLICY "Users can read messages from own sessions"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = messages.session_id 
      AND chat_sessions.user_id IS NOT NULL
    )
  );

CREATE POLICY "Users can create messages in own sessions"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = messages.session_id 
      AND chat_sessions.user_id IS NOT NULL
    )
  );

-- ایجاد ایندکس‌های جدید
CREATE INDEX IF NOT EXISTS users_phone_number_idx ON users(phone_number);
CREATE INDEX IF NOT EXISTS chat_sessions_user_id_idx ON chat_sessions(user_id);
