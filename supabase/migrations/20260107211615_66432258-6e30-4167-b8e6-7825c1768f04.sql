-- Add image_url column to insights table
ALTER TABLE public.insights 
ADD COLUMN image_url text;