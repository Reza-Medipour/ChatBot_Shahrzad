/*
  # Add shahrzaad_id to chat_sessions

  ## Changes
    - Add shahrzaad_id column to chat_sessions table
    - Add index for fast lookups
    - Update RLS policies to allow public access (for now)

  ## Notes
    - This allows linking chat sessions to external Shahrzaad system users
    - In production, policies should be restricted based on shahrzaad_id
*/

-- Add shahrzaad_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chat_sessions' AND column_name = 'shahrzaad_id'
  ) THEN
    ALTER TABLE chat_sessions ADD COLUMN shahrzaad_id text;
  END IF;
END $$;

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_chat_sessions_shahrzaad_id ON chat_sessions(shahrzaad_id);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read chat_sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Allow public insert chat_sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Allow public update chat_sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Allow public delete chat_sessions" ON chat_sessions;

DROP POLICY IF EXISTS "Allow public read messages" ON messages;
DROP POLICY IF EXISTS "Allow public insert messages" ON messages;
DROP POLICY IF EXISTS "Allow public update messages" ON messages;
DROP POLICY IF EXISTS "Allow public delete messages" ON messages;

-- Create policies for public access
CREATE POLICY "Allow public read chat_sessions"
  ON chat_sessions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert chat_sessions"
  ON chat_sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update chat_sessions"
  ON chat_sessions FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete chat_sessions"
  ON chat_sessions FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read messages"
  ON messages FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert messages"
  ON messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update messages"
  ON messages FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete messages"
  ON messages FOR DELETE
  TO anon, authenticated
  USING (true);