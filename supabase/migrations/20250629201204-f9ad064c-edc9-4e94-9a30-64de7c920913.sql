
-- Add missing columns to feedback table for rating and stoke functionality
ALTER TABLE public.feedback 
ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 6),
ADD COLUMN IF NOT EXISTS stoke INTEGER CHECK (stoke >= 1 AND stoke <= 5),
ADD COLUMN IF NOT EXISTS comment TEXT,
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false;

-- Update the message column to allow NULL since we now have comment
ALTER TABLE public.feedback 
ALTER COLUMN message DROP NOT NULL;

-- Add RLS policies for feedback
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and create new ones
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.feedback;
DROP POLICY IF EXISTS "Approved feedback is viewable by everyone" ON public.feedback;

-- Allow anyone to submit feedback
CREATE POLICY "Anyone can submit feedback" ON public.feedback
  FOR INSERT WITH CHECK (true);

-- Only show approved feedback publicly
CREATE POLICY "Approved feedback is viewable by everyone" ON public.feedback
  FOR SELECT USING (approved = true);
