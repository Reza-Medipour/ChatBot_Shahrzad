/*
  # ایجاد سیستم چت پشتیبانی

  1. جداول جدید
    - `chat_sessions`
      - `id` (uuid, primary key)
      - `title` (text) - عنوان چت
      - `created_at` (timestamptz) - زمان ایجاد
      - `updated_at` (timestamptz) - زمان آخرین به‌روزرسانی
    
    - `messages`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key) - شناسه جلسه چت
      - `content` (text) - محتوای پیام
      - `is_user` (boolean) - آیا پیام از کاربر است؟
      - `created_at` (timestamptz) - زمان ارسال پیام

  2. امنیت
    - فعال‌سازی RLS برای هر دو جدول
    - اجازه خواندن و نوشتن عمومی برای دموی اپلیکیشن

  نکات مهم:
    - این یک اپلیکیشن دمو است و RLS به صورت عمومی تنظیم شده
    - در محیط واقعی باید احراز هویت اضافه شود
*/

-- ایجاد جدول جلسات چت
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text DEFAULT 'چت جدید',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ایجاد جدول پیام‌ها
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  is_user boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- فعال‌سازی RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ایجاد پالیسی‌ها با استفاده از DO block
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'chat_sessions' AND policyname = 'Anyone can read chat sessions'
  ) THEN
    CREATE POLICY "Anyone can read chat sessions"
      ON chat_sessions FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'chat_sessions' AND policyname = 'Anyone can create chat sessions'
  ) THEN
    CREATE POLICY "Anyone can create chat sessions"
      ON chat_sessions FOR INSERT
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'chat_sessions' AND policyname = 'Anyone can update chat sessions'
  ) THEN
    CREATE POLICY "Anyone can update chat sessions"
      ON chat_sessions FOR UPDATE
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'chat_sessions' AND policyname = 'Anyone can delete chat sessions'
  ) THEN
    CREATE POLICY "Anyone can delete chat sessions"
      ON chat_sessions FOR DELETE
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Anyone can read messages'
  ) THEN
    CREATE POLICY "Anyone can read messages"
      ON messages FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Anyone can create messages'
  ) THEN
    CREATE POLICY "Anyone can create messages"
      ON messages FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- ایجاد ایندکس برای بهبود عملکرد
CREATE INDEX IF NOT EXISTS messages_session_id_idx ON messages(session_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at);
CREATE INDEX IF NOT EXISTS chat_sessions_updated_at_idx ON chat_sessions(updated_at);