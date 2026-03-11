-- Fix missing trigger for auto-creating profiles on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create crops table for listings
CREATE TABLE public.crops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  crop_name TEXT NOT NULL,
  price_per_kg NUMERIC NOT NULL,
  quantity_kg NUMERIC NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;

-- Farmers can insert their own crops
CREATE POLICY "Users can insert their own crops"
  ON public.crops FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Anyone can view crops (public marketplace)
CREATE POLICY "Anyone can view crops"
  ON public.crops FOR SELECT
  TO public
  USING (true);

-- Users can update their own crops
CREATE POLICY "Users can update their own crops"
  ON public.crops FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own crops
CREATE POLICY "Users can delete their own crops"
  ON public.crops FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);