-- ============================================================
-- FieldV3 — Initial schema + RLS
-- Run this once in your Supabase project's SQL Editor.
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES
-- One row per auth.users entry; created automatically via trigger.
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id         UUID        PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email      TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: select own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: insert own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles: update own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create a profile row whenever a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- BOARDS
-- ============================================================

CREATE TABLE IF NOT EXISTS boards (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  title      TEXT        NOT NULL CHECK (char_length(title) > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_boards_user_id ON boards (user_id);

ALTER TABLE boards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "boards: select own"
  ON boards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "boards: insert own"
  ON boards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "boards: update own"
  ON boards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "boards: delete own"
  ON boards FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- PINS
-- ============================================================

CREATE TABLE IF NOT EXISTS pins (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  board_id   UUID        NOT NULL REFERENCES boards (id) ON DELETE CASCADE,
  image_url  TEXT        NOT NULL CHECK (char_length(image_url) > 0),
  title      TEXT,
  link_url   TEXT,
  note       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pins_user_id    ON pins (user_id);
CREATE INDEX IF NOT EXISTS idx_pins_board_id   ON pins (board_id);
CREATE INDEX IF NOT EXISTS idx_pins_created_at ON pins (created_at DESC);

ALTER TABLE pins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pins: select own"
  ON pins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "pins: insert own"
  ON pins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "pins: update own"
  ON pins FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "pins: delete own"
  ON pins FOR DELETE
  USING (auth.uid() = user_id);
