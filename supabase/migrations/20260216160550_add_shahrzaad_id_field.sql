/*
  # Add Shahrzaad ID Integration

  1. Changes
    - Add `shahrzaad_id` field to users table (STRING, UNIQUE, NULLABLE initially)
    - Make `phone_number` nullable for users coming from Shahrzaad without phone
    - Add index on `shahrzaad_id` for fast lookups
  
  2. Migration Strategy
    - Add shahrzaad_id column
    - Create unique constraint and index
    - Modify phone_number to be nullable
  
  3. Security
    - Existing RLS policies remain unchanged
    - Users authenticated by shahrzaad_id will follow same security rules
*/

-- Add shahrzaad_id column to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'shahrzaad_id'
  ) THEN
    ALTER TABLE users ADD COLUMN shahrzaad_id TEXT;
  END IF;
END $$;

-- Create unique constraint on shahrzaad_id (only for non-null values)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_shahrzaad_id_key'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_shahrzaad_id_key UNIQUE (shahrzaad_id);
  END IF;
END $$;

-- Create index on shahrzaad_id for fast lookups
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_shahrzaad_id'
  ) THEN
    CREATE INDEX idx_users_shahrzaad_id ON users(shahrzaad_id) WHERE shahrzaad_id IS NOT NULL;
  END IF;
END $$;

-- Make phone_number nullable (if it's not already)
DO $$
BEGIN
  ALTER TABLE users ALTER COLUMN phone_number DROP NOT NULL;
EXCEPTION
  WHEN others THEN
    -- Column might already be nullable
    NULL;
END $$;