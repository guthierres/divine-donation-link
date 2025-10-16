-- Adicionar colunas do InfinitePay na tabela parishes
ALTER TABLE public.parishes 
ADD COLUMN IF NOT EXISTS infinitepay_api_key TEXT,
ADD COLUMN IF NOT EXISTS infinitepay_configured BOOLEAN NOT NULL DEFAULT false;