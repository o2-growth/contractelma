-- Create templates table for storing contract templates
CREATE TABLE public.templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  placeholders JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contracts table for generated contracts
CREATE TABLE public.contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL,
  client_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  products JSONB NOT NULL DEFAULT '[]'::jsonb,
  payment_terms TEXT,
  special_notes TEXT,
  total_value DECIMAL(15,2) DEFAULT 0,
  generated_file_url TEXT,
  pdf_file_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'generated', 'sent')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create extraction_logs table for tracking AI extractions
CREATE TABLE public.extraction_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE,
  original_file_url TEXT,
  extracted_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  confidence_score DECIMAL(3,2) DEFAULT 0,
  manual_corrections JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extraction_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for templates
CREATE POLICY "Users can view their own templates"
ON public.templates FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own templates"
ON public.templates FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
ON public.templates FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
ON public.templates FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for contracts
CREATE POLICY "Users can view their own contracts"
ON public.contracts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contracts"
ON public.contracts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contracts"
ON public.contracts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contracts"
ON public.contracts FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for extraction_logs (based on contract ownership)
CREATE POLICY "Users can view extraction logs for their contracts"
ON public.extraction_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.contracts
    WHERE contracts.id = extraction_logs.contract_id
    AND contracts.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create extraction logs for their contracts"
ON public.extraction_logs FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.contracts
    WHERE contracts.id = extraction_logs.contract_id
    AND contracts.user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on templates
CREATE TRIGGER update_templates_updated_at
BEFORE UPDATE ON public.templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Storage policies for documents bucket
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);