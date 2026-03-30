
-- Create function to update timestamps (if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create analyses table
CREATE TABLE public.analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  facebook_url TEXT NOT NULL,
  competitors TEXT[] DEFAULT '{}',
  market_score INTEGER,
  comparison JSONB,
  swot JSONB,
  content_plan JSONB,
  raw_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read analyses (no auth yet)
CREATE POLICY "Analyses are publicly readable"
  ON public.analyses FOR SELECT USING (true);

-- Allow inserts from service role (edge functions)
CREATE POLICY "Service role can insert analyses"
  ON public.analyses FOR INSERT WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_analyses_updated_at
  BEFORE UPDATE ON public.analyses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
