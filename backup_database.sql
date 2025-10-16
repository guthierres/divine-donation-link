-- =====================================================
-- BACKUP COMPLETO DO BANCO DE DADOS
-- Sistema SaaS Católico de Campanhas de Doações
-- Data: 2025-10-16
-- =====================================================

-- =====================================================
-- 1. TIPOS ENUMERADOS (ENUMS)
-- =====================================================

CREATE TYPE public.app_role AS ENUM ('admin', 'parish');

CREATE TYPE public.campaign_category AS ENUM (
  'reforma',
  'evento',
  'social',
  'educacao',
  'missoes',
  'outros'
);

CREATE TYPE public.campaign_status AS ENUM ('draft', 'active', 'completed', 'cancelled');

CREATE TYPE public.donation_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

CREATE TYPE public.parish_status AS ENUM ('pending', 'active', 'inactive');

CREATE TYPE public.payment_method AS ENUM ('credit_card', 'pix', 'boleto');

-- =====================================================
-- 2. TABELAS
-- =====================================================

-- Tabela de usuários (extends auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de roles dos usuários
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Tabela de paróquias
CREATE TABLE public.parishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
  pagarme_secret_key TEXT,
  pagarme_configured BOOLEAN NOT NULL DEFAULT FALSE,
  infinitepay_api_key TEXT,
  infinitepay_configured BOOLEAN NOT NULL DEFAULT FALSE,
  status parish_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de campanhas
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL,
  category campaign_category NOT NULL,
  goal_amount NUMERIC NOT NULL,
  current_amount NUMERIC NOT NULL DEFAULT 0,
  image_url TEXT,
  video_url TEXT,
  status campaign_status NOT NULL DEFAULT 'draft',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (parish_id, slug)
);

-- Tabela de doações
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  donor_phone TEXT,
  amount NUMERIC NOT NULL,
  payment_method payment_method NOT NULL,
  status donation_status NOT NULL DEFAULT 'pending',
  transaction_id TEXT,
  pagarme_response JSONB,
  message TEXT,
  anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de notificações
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  donation_id UUID REFERENCES public.donations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 3. ÍNDICES
-- =====================================================

CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_parishes_user_id ON public.parishes(user_id);
CREATE INDEX idx_parishes_slug ON public.parishes(slug);
CREATE INDEX idx_parishes_status ON public.parishes(status);
CREATE INDEX idx_campaigns_parish_id ON public.campaigns(parish_id);
CREATE INDEX idx_campaigns_slug ON public.campaigns(slug);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_donations_campaign_id ON public.donations(campaign_id);
CREATE INDEX idx_donations_parish_id ON public.donations(parish_id);
CREATE INDEX idx_donations_status ON public.donations(status);
CREATE INDEX idx_notifications_parish_id ON public.notifications(parish_id);

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. FUNÇÕES
-- =====================================================

-- Função para verificar se usuário tem uma role específica
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
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

-- Função para criar usuário automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Função para atualizar valor da campanha quando doação é paga
CREATE OR REPLACE FUNCTION public.update_campaign_amount()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
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
$$;

-- =====================================================
-- 6. TRIGGERS
-- =====================================================

-- Trigger para criar usuário automaticamente ao signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parishes_updated_at
  BEFORE UPDATE ON public.parishes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para atualizar valor da campanha
CREATE TRIGGER on_donation_paid
  AFTER INSERT OR UPDATE ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_campaign_amount();

-- =====================================================
-- 7. POLÍTICAS RLS
-- =====================================================

-- Políticas para users
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Políticas para user_roles
CREATE POLICY "Usuários podem ver suas próprias roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins podem gerenciar roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para parishes
CREATE POLICY "Todos podem ver paróquias ativas"
  ON public.parishes FOR SELECT
  USING (
    status = 'active' OR 
    user_id = auth.uid() OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Usuários podem criar paróquias"
  ON public.parishes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Paróquias podem atualizar seus dados"
  ON public.parishes FOR UPDATE
  USING (
    auth.uid() = user_id OR 
    public.has_role(auth.uid(), 'admin')
  );

-- Políticas para campaigns
CREATE POLICY "Todos podem ver campanhas ativas"
  ON public.campaigns FOR SELECT
  USING (
    status = 'active' OR
    EXISTS (
      SELECT 1 FROM public.parishes
      WHERE parishes.id = campaigns.parish_id
        AND parishes.user_id = auth.uid()
    ) OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Paróquias podem criar campanhas"
  ON public.campaigns FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.parishes
      WHERE parishes.id = campaigns.parish_id
        AND parishes.user_id = auth.uid()
    )
  );

CREATE POLICY "Paróquias podem atualizar suas campanhas"
  ON public.campaigns FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.parishes
      WHERE parishes.id = campaigns.parish_id
        AND parishes.user_id = auth.uid()
    ) OR
    public.has_role(auth.uid(), 'admin')
  );

-- Políticas para donations
CREATE POLICY "Sistema pode inserir doações"
  ON public.donations FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Sistema pode atualizar doações"
  ON public.donations FOR UPDATE
  USING (TRUE);

CREATE POLICY "Paróquias podem ver suas doações"
  ON public.donations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.parishes
      WHERE parishes.id = donations.parish_id
        AND parishes.user_id = auth.uid()
    ) OR
    public.has_role(auth.uid(), 'admin')
  );

-- Políticas para notifications
CREATE POLICY "Paróquias podem ver suas notificações"
  ON public.notifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.parishes
      WHERE parishes.id = notifications.parish_id
        AND parishes.user_id = auth.uid()
    )
  );

CREATE POLICY "Paróquias podem atualizar suas notificações"
  ON public.notifications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.parishes
      WHERE parishes.id = notifications.parish_id
        AND parishes.user_id = auth.uid()
    )
  );

-- =====================================================
-- FIM DO BACKUP
-- =====================================================

-- NOTA: Este backup inclui:
-- ✓ Todos os tipos enumerados (enums)
-- ✓ Todas as tabelas com suas constraints
-- ✓ Todos os índices
-- ✓ Todas as funções (has_role, handle_new_user, update_updated_at_column, update_campaign_amount)
-- ✓ Todos os triggers
-- ✓ Todas as políticas RLS
-- ✓ A coluna responsible_name já existe na tabela parishes

-- Para restaurar este backup em outro banco:
-- 1. Certifique-se de que o schema auth existe (é criado automaticamente pelo Supabase)
-- 2. Execute este script SQL completo
-- 3. Configure as variáveis de ambiente no novo projeto
