-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (mirrors auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Classifications table
CREATE TABLE IF NOT EXISTS classifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Entries table
CREATE TABLE IF NOT EXISTS entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  classification_id UUID NOT NULL REFERENCES classifications(id) ON DELETE RESTRICT,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL,
  description TEXT,
  is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
  recurrence_group_id UUID,
  recurrence_end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Closed months table
CREATE TABLE IF NOT EXISTS closed_months (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  closed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, year, month)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_entries_user_id ON entries(user_id);
CREATE INDEX IF NOT EXISTS idx_entries_date ON entries(date);
CREATE INDEX IF NOT EXISTS idx_entries_user_date ON entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_entries_recurrence_group ON entries(recurrence_group_id);
CREATE INDEX IF NOT EXISTS idx_classifications_user_id ON classifications(user_id);
CREATE INDEX IF NOT EXISTS idx_closed_months_user_id ON closed_months(user_id);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE closed_months ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for classifications
CREATE POLICY "Users can view own classifications" ON classifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own classifications" ON classifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own classifications" ON classifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own classifications" ON classifications
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for entries
CREATE POLICY "Users can view own entries" ON entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries" ON entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries" ON entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries" ON entries
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for closed_months
CREATE POLICY "Users can view own closed months" ON closed_months
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own closed months" ON closed_months
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own closed months" ON closed_months
  FOR DELETE USING (auth.uid() = user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
