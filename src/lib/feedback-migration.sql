
-- Create feedback table with proper structure
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rating INTEGER CHECK (rating >= 1 AND rating <= 6),
  stoke INTEGER CHECK (stoke >= 1 AND stoke <= 5),
  comment TEXT NOT NULL,
  display_name TEXT,
  email TEXT,
  image_url TEXT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for feedback images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('feedback-images', 'feedback-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to feedback images
CREATE POLICY "Public read access for feedback images" ON storage.objects
FOR SELECT USING (bucket_id = 'feedback-images');

CREATE POLICY "Authenticated insert for feedback images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'feedback-images' AND auth.role() = 'authenticated');
