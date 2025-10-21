-- Create enum for QA test status
CREATE TYPE public.qa_status AS ENUM ('pending', 'approved', 'in_progress', 'completed', 'rejected');

-- Create enum for test types
CREATE TYPE public.test_type AS ENUM ('quality_check', 'pesticide_residue', 'moisture_content', 'purity_test', 'full_analysis');

-- Create QA requests table
CREATE TABLE public.qa_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  crop_name TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  location TEXT NOT NULL,
  test_type test_type NOT NULL,
  status qa_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.qa_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for qa_requests
CREATE POLICY "Users can view their own QA requests"
ON public.qa_requests
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own QA requests"
ON public.qa_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own QA requests"
ON public.qa_requests
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_qa_requests_updated_at
BEFORE UPDATE ON public.qa_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create market prices table
CREATE TABLE public.market_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_name TEXT NOT NULL,
  price_per_kg NUMERIC NOT NULL,
  location TEXT NOT NULL,
  market_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;

-- RLS Policies - anyone can view market prices
CREATE POLICY "Anyone can view market prices"
ON public.market_prices
FOR SELECT
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_market_prices_updated_at
BEFORE UPDATE ON public.market_prices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample market prices
INSERT INTO public.market_prices (crop_name, price_per_kg, location, market_date) VALUES
('Foxtail Millet', 45.50, 'Delhi', CURRENT_DATE),
('Pearl Millet', 38.00, 'Delhi', CURRENT_DATE),
('Finger Millet', 52.00, 'Delhi', CURRENT_DATE),
('Foxtail Millet', 42.00, 'Mumbai', CURRENT_DATE),
('Pearl Millet', 35.50, 'Mumbai', CURRENT_DATE),
('Finger Millet', 48.00, 'Mumbai', CURRENT_DATE),
('Foxtail Millet', 47.00, 'Bangalore', CURRENT_DATE),
('Pearl Millet', 40.00, 'Bangalore', CURRENT_DATE),
('Finger Millet', 55.00, 'Bangalore', CURRENT_DATE);