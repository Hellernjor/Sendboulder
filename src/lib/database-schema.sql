
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('gym', 'outdoor')) NOT NULL,
  address TEXT,
  coordinates JSONB, -- {lat: number, lng: number}
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_by_username TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  route_change_frequency TEXT CHECK (route_change_frequency IN ('weekly', 'monthly', 'rarely', 'never')) DEFAULT 'monthly',
  is_global BOOLEAN DEFAULT false
);

-- Create grade_levels table
CREATE TABLE IF NOT EXISTS grade_levels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  color TEXT NOT NULL,
  name TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'easy', 'intermediate', 'advanced', 'expert')) NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  grade_id UUID REFERENCES grade_levels(id) NOT NULL,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  removed_at TIMESTAMP WITH TIME ZONE,
  personal_route BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id) NOT NULL
);

-- Create attempts table
CREATE TABLE IF NOT EXISTS attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE NOT NULL,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  completed BOOLEAN NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 1,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback table (already exists but including for completeness)
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies

-- Profiles policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Locations policies
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Locations are viewable by everyone" ON locations
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create locations" ON locations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own locations" ON locations
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own locations" ON locations
  FOR DELETE USING (auth.uid() = created_by);

-- Grade levels policies
ALTER TABLE grade_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Grade levels are viewable by everyone" ON grade_levels
  FOR SELECT USING (true);

CREATE POLICY "Location creators can manage grade levels" ON grade_levels
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM locations 
      WHERE locations.id = grade_levels.location_id 
      AND locations.created_by = auth.uid()
    )
  );

-- Routes policies
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Routes are viewable by everyone" ON routes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create routes" ON routes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own routes" ON routes
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own routes" ON routes
  FOR DELETE USING (auth.uid() = created_by);

-- Attempts policies
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own attempts" ON attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own attempts" ON attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attempts" ON attempts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own attempts" ON attempts
  FOR DELETE USING (auth.uid() = user_id);

-- Feedback policies (already exists)
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback" ON feedback
  FOR INSERT WITH CHECK (true);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_locations_created_by ON locations(created_by);
CREATE INDEX IF NOT EXISTS idx_locations_type ON locations(type);
CREATE INDEX IF NOT EXISTS idx_grade_levels_location_id ON grade_levels(location_id);
CREATE INDEX IF NOT EXISTS idx_routes_location_id ON routes(location_id);
CREATE INDEX IF NOT EXISTS idx_routes_grade_id ON routes(grade_id);
CREATE INDEX IF NOT EXISTS idx_routes_created_by ON routes(created_by);
CREATE INDEX IF NOT EXISTS idx_routes_is_active ON routes(is_active);
CREATE INDEX IF NOT EXISTS idx_attempts_user_id ON attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_route_id ON attempts(route_id);
CREATE INDEX IF NOT EXISTS idx_attempts_date ON attempts(date);

-- Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
