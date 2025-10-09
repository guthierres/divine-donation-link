/*
  # Sistema Completo de Doações para Paróquias Católicas

  1. Tipos Enum
    - app_role: Papéis de usuários (admin, parish)
    - parish_status: Status de paróquias (pending, active, inactive)
    - donation_status: Status de doações (pending, processing, paid, failed, refunded)
    - payment_method: Métodos de pagamento (credit_card, pix, boleto)
    - campaign_category: Categorias de campanhas
    - campaign_status: Status de campanhas

  2. Tabelas Principais
    - users: Perfis de usuários vinculados ao auth
    - user_roles: Papéis e permissões de usuários
    - parishes: Paróquias cadastradas
    - campaigns: Campanhas de arrecadação
    - donations: Doações recebidas
    - notifications: Notificações de novas doações

  3. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas restritivas para cada tipo de acesso
    - Triggers para automação

  4. Funcionalidades
    - Criação automática de perfil ao cadastrar
    - Atualização automática de valores arrecadados
    - Sistema de notificações em tempo real
    - Suporte a realtime para notificações e doações
*/

-- Criar tipos enum
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'parish');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.parish_status AS ENUM ('pending', 'active', 'inactive');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.donation_status AS ENUM ('pending', 'processing', 'paid', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_method AS ENUM ('credit_card', 'pix', 'boleto');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.campaign_category AS ENUM ('reforma', 'construcao', 'eventos', 'missas', 'caridade', 'outros');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.campaign_status AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de roles de usuários
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Função para verificar role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Tabela de paróquias
CREATE TABLE IF NOT EXISTS public.parishes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  cnpj TEXT,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  responsible_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  logo_url TEXT,
  cover_url TEXT,
  icon_url TEXT,
  description TEXT,
  status parish_status NOT NULL DEFAULT 'pending',
  pagarme_secret_key TEXT,
  pagarme_configured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de campanhas
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL,
  category campaign_category NOT NULL,
  goal_amount DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  image_url TEXT,
  video_url TEXT,
  status campaign_status NOT NULL DEFAULT 'draft',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(parish_id, slug)
);

-- Tabela de doações
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  donor_phone TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method payment_method NOT NULL,
  status donation_status NOT NULL DEFAULT 'pending',
  transaction_id TEXT,
  pagarme_response JSONB,
  anonymous BOOLEAN NOT NULL DEFAULT false,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  donation_id UUID REFERENCES public.donations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies para users
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.users;
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.users;
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem inserir seu próprio perfil" ON public.users;
CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies para user_roles
DROP POLICY IF EXISTS "Usuários podem ver suas próprias roles" ON public.user_roles;
CREATE POLICY "Usuários podem ver suas próprias roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins podem gerenciar roles" ON public.user_roles;
CREATE POLICY "Admins podem gerenciar roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies para parishes
DROP POLICY IF EXISTS "Todos podem ver paróquias ativas" ON public.parishes;
CREATE POLICY "Todos podem ver paróquias ativas"
  ON public.parishes FOR SELECT
  USING (status = 'active' OR user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Usuários podem criar paróquias" ON public.parishes;
CREATE POLICY "Usuários podem criar paróquias"
  ON public.parishes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Paróquias podem atualizar seus dados" ON public.parishes;
CREATE POLICY "Paróquias podem atualizar seus dados"
  ON public.parishes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies para campaigns
DROP POLICY IF EXISTS "Todos podem ver campanhas ativas" ON public.campaigns;
CREATE POLICY "Todos podem ver campanhas ativas"
  ON public.campaigns FOR SELECT
  USING (status = 'active' OR EXISTS (
    SELECT 1 FROM public.parishes 
    WHERE parishes.id = campaigns.parish_id 
    AND parishes.user_id = auth.uid()
  ) OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Paróquias podem criar campanhas" ON public.campaigns;
CREATE POLICY "Paróquias podem criar campanhas"
  ON public.campaigns FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.parishes 
    WHERE parishes.id = parish_id 
    AND parishes.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Paróquias podem atualizar suas campanhas" ON public.campaigns;
CREATE POLICY "Paróquias podem atualizar suas campanhas"
  ON public.campaigns FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.parishes 
    WHERE parishes.id = campaigns.parish_id 
    AND parishes.user_id = auth.uid()
  ) OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Paróquias podem deletar suas campanhas" ON public.campaigns;
CREATE POLICY "Paróquias podem deletar suas campanhas"
  ON public.campaigns FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.parishes 
    WHERE parishes.id = campaigns.parish_id 
    AND parishes.user_id = auth.uid()
  ) OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies para donations
DROP POLICY IF EXISTS "Paróquias podem ver suas doações" ON public.donations;
CREATE POLICY "Paróquias podem ver suas doações"
  ON public.donations FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.parishes 
    WHERE parishes.id = donations.parish_id 
    AND parishes.user_id = auth.uid()
  ) OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Sistema pode inserir doações" ON public.donations;
CREATE POLICY "Sistema pode inserir doações"
  ON public.donations FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Sistema pode atualizar doações" ON public.donations;
CREATE POLICY "Sistema pode atualizar doações"
  ON public.donations FOR UPDATE
  USING (true);

-- RLS Policies para notifications
DROP POLICY IF EXISTS "Paróquias podem ver suas notificações" ON public.notifications;
CREATE POLICY "Paróquias podem ver suas notificações"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.parishes 
    WHERE parishes.id = notifications.parish_id 
    AND parishes.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Paróquias podem atualizar suas notificações" ON public.notifications;
CREATE POLICY "Paróquias podem atualizar suas notificações"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.parishes 
    WHERE parishes.id = notifications.parish_id 
    AND parishes.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Sistema pode inserir notificações" ON public.notifications;
CREATE POLICY "Sistema pode inserir notificações"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_parishes_updated_at ON public.parishes;
CREATE TRIGGER update_parishes_updated_at BEFORE UPDATE ON public.parishes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_campaigns_updated_at ON public.campaigns;
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_donations_updated_at ON public.donations;
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON public.donations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para criar perfil de usuário automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger para atualizar current_amount e criar notificação quando há nova doação paga
CREATE OR REPLACE FUNCTION public.update_campaign_amount()
RETURNS TRIGGER AS $$
DECLARE
  campaign_title TEXT;
BEGIN
  IF NEW.status = 'paid' AND (OLD IS NULL OR OLD.status != 'paid') THEN
    UPDATE public.campaigns
    SET current_amount = current_amount + NEW.amount
    WHERE id = NEW.campaign_id
    RETURNING title INTO campaign_title;
    
    INSERT INTO public.notifications (parish_id, donation_id, title, message)
    VALUES (
      NEW.parish_id,
      NEW.id,
      'Nova Doação Recebida!',
      'Você recebeu uma doação de R$ ' || TO_CHAR(NEW.amount, 'FM999G999G990D00') || 
      CASE 
        WHEN campaign_title IS NOT NULL THEN ' para a campanha "' || campaign_title || '"'
        ELSE ''
      END ||
      CASE 
        WHEN NOT NEW.anonymous THEN ' de ' || NEW.donor_name
        ELSE ' (doação anônima)'
      END || '.'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_donation_paid ON public.donations;
CREATE TRIGGER on_donation_paid
  AFTER INSERT OR UPDATE ON public.donations
  FOR EACH ROW EXECUTE FUNCTION public.update_campaign_amount();
