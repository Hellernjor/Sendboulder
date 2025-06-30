
-- Add missing indexes for better query performance

-- Indexes for feedback table queries
CREATE INDEX IF NOT EXISTS idx_feedback_approved ON feedback(approved);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);

-- Indexes for profiles table queries
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Additional indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_routes_personal_route ON routes(personal_route);
CREATE INDEX IF NOT EXISTS idx_routes_location_active ON routes(location_id, is_active);
CREATE INDEX IF NOT EXISTS idx_attempts_user_date ON attempts(user_id, date);
CREATE INDEX IF NOT EXISTS idx_attempts_completed ON attempts(completed);

-- Composite indexes for common join patterns
CREATE INDEX IF NOT EXISTS idx_grade_levels_location_order ON grade_levels(location_id, order_index);
CREATE INDEX IF NOT EXISTS idx_routes_grade_location ON routes(grade_id, location_id, is_active);

-- Index for locations with coordinates (for distance calculations)
CREATE INDEX IF NOT EXISTS idx_locations_coordinates ON locations USING GIN(coordinates);
