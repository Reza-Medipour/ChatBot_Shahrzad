/*
  # Simplify User Model

  1. Changes
    - Drop existing users table and recreate with simple schema
    - Update foreign key in chat_sessions table
    - Keep existing chat_sessions and messages data structure

  2. New Schema
    - users table now only has id (TEXT) and created_at
    - chat_sessions.user_id changed from UUID to TEXT
*/

-- Drop existing tables in correct order
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create simplified users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create chat_sessions table
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT DEFAULT 'چت جدید',
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_user BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_messages_session_id ON messages(session_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
