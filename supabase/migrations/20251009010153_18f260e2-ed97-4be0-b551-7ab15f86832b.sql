-- Criar tipo enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'parish');

-- Criar tipo enum para status de paróquias
CREATE TYPE public.parish_status AS ENUM ('pending', 'active', 'inactive');

-- Criar tipo enum para status de doações
CREATE TYPE public.donation_status AS ENUM ('pending', 'processing', 'paid', 'failed', 'refunded');

-- Criar tipo enum para métodos de pagamento
CREATE TYPE public.payment_method AS ENUM ('credit_card', 'pix', 'boleto');

-- Criar tipo enum para categorias de campanhas
CREATE TYPE public.campaign_category AS ENUM ('reforma', 'construcao', 'eventos', 'missas', 'caridade', 'outros');

-- Criar tipo enum para status de campanhas
CREATE TYPE public.campaign_status AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled');

-- Tabela de perfis de usuários
CREATE TABLE public.users (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de roles de usuários
CREATE TABLE public.user_roles (
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
CREATE TABLE public.parishes (
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
CREATE TABLE public.campaigns (
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
CREATE TABLE public.donations (
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
CREATE TABLE public.notifications (
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
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies para user_roles
CREATE POLICY "Usuários podem ver suas próprias roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins podem gerenciar roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies para parishes
CREATE POLICY "Todos podem ver paróquias ativas"
  ON public.parishes FOR SELECT
  USING (status = 'active' OR user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Usuários podem criar paróquias"
  ON public.parishes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Paróquias podem atualizar seus dados"
  ON public.parishes FOR UPDATE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies para campaigns
CREATE POLICY "Todos podem ver campanhas ativas"
  ON public.campaigns FOR SELECT
  USING (status = 'active' OR EXISTS (
    SELECT 1 FROM public.parishes 
    WHERE parishes.id = campaigns.parish_id 
    AND parishes.user_id = auth.uid()
  ) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Paróquias podem criar campanhas"
  ON public.campaigns FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.parishes 
    WHERE parishes.id = parish_id 
    AND parishes.user_id = auth.uid()
  ));

CREATE POLICY "Paróquias podem atualizar suas campanhas"
  ON public.campaigns FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.parishes 
    WHERE parishes.id = campaigns.parish_id 
    AND parishes.user_id = auth.uid()
  ) OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies para donations
CREATE POLICY "Paróquias podem ver suas doações"
  ON public.donations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.parishes 
    WHERE parishes.id = donations.parish_id 
    AND parishes.user_id = auth.uid()
  ) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Sistema pode inserir doações"
  ON public.donations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Sistema pode atualizar doações"
  ON public.donations FOR UPDATE
  USING (true);

-- RLS Policies para notifications
CREATE POLICY "Paróquias podem ver suas notificações"
  ON public.notifications FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.parishes 
    WHERE parishes.id = notifications.parish_id 
    AND parishes.user_id = auth.uid()
  ));

CREATE POLICY "Paróquias podem atualizar suas notificações"
  ON public.notifications FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.parishes 
    WHERE parishes.id = notifications.parish_id 
    AND parishes.user_id = auth.uid()
  ));

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parishes_updated_at BEFORE UPDATE ON public.parishes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

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
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger para atualizar current_amount quando há nova doação paga
CREATE OR REPLACE FUNCTION public.update_campaign_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'paid' AND (OLD IS NULL OR OLD.status != 'paid') THEN
    UPDATE public.campaigns
    SET current_amount = current_amount + NEW.amount
    WHERE id = NEW.campaign_id;
    
    -- Criar notificação
    INSERT INTO public.notifications (parish_id, donation_id, title, message)
    VALUES (
      NEW.parish_id,
      NEW.id,
      'Nova Doação Recebida!',
      'Você recebeu uma doação de R$ ' || NEW.amount::TEXT || ' para sua campanha.'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_donation_paid
  AFTER INSERT OR UPDATE ON public.donations
  FOR EACH ROW EXECUTE FUNCTION public.update_campaign_amount();

-- Habilitar realtime para notificações e doações
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.donations;