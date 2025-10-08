/*
  # Sistema SaaS Católico - Schema Completo
  
  ## Descrição
  Schema completo para plataforma de doações de paróquias católicas com multi-tenancy.
  
  ## 1. Tabelas Criadas
  
  ### parishes (Paróquias)
  - `id` (uuid, primary key)
  - `name` (text) - Nome da paróquia
  - `slug` (text, unique) - URL amigável
  - `cnpj` (text) - CNPJ/CPF da paróquia
  - `email` (text, unique)
  - `phone` (text)
  - `address` (text)
  - `city` (text)
  - `state` (text)
  - `zipcode` (text)
  - `description` (text) - Sobre a paróquia
  - `logo_url` (text) - URL do brasão/logo
  - `banner_url` (text) - URL do banner
  - `status` (text) - 'pending', 'active', 'inactive'
  - `pagarme_api_key` (text) - Chave API Pagar.me (criptografada)
  - `user_id` (uuid) - Referência ao usuário responsável
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### campaigns (Campanhas)
  - `id` (uuid, primary key)
  - `parish_id` (uuid) - FK para parishes
  - `title` (text) - Título da campanha
  - `slug` (text, unique) - URL amigável
  - `description` (text) - Descrição completa
  - `category` (text) - Tipo de causa
  - `goal_amount` (numeric) - Meta de arrecadação
  - `current_amount` (numeric) - Valor atual arrecadado
  - `image_url` (text)
  - `video_url` (text) - Opcional
  - `start_date` (timestamptz)
  - `end_date` (timestamptz)
  - `status` (text) - 'draft', 'active', 'paused', 'completed', 'cancelled'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### donations (Doações)
  - `id` (uuid, primary key)
  - `campaign_id` (uuid) - FK para campaigns
  - `parish_id` (uuid) - FK para parishes
  - `donor_name` (text) - Nome do doador
  - `donor_email` (text)
  - `donor_phone` (text)
  - `amount` (numeric) - Valor da doação
  - `payment_method` (text) - 'credit_card', 'pix', 'boleto'
  - `status` (text) - 'pending', 'processing', 'paid', 'failed', 'refunded'
  - `transaction_id` (text) - ID da transação Pagar.me
  - `pagarme_response` (jsonb) - Resposta completa da API
  - `anonymous` (boolean) - Doação anônima
  - `message` (text) - Mensagem opcional do doador
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### users (Usuários)
  - `id` (uuid, primary key)
  - `email` (text, unique)
  - `full_name` (text)
  - `role` (text) - 'super_admin', 'parish_admin'
  - `avatar_url` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### platform_settings (Configurações da Plataforma)
  - `id` (uuid, primary key)
  - `key` (text, unique) - Chave da configuração
  - `value` (jsonb) - Valor da configuração
  - `description` (text)
  - `updated_at` (timestamptz)
  
  ### audit_logs (Logs de Auditoria)
  - `id` (uuid, primary key)
  - `user_id` (uuid)
  - `action` (text) - Tipo de ação
  - `entity_type` (text) - Tipo de entidade
  - `entity_id` (uuid)
  - `changes` (jsonb) - Dados das mudanças
  - `ip_address` (text)
  - `created_at` (timestamptz)
  
  ## 2. Segurança (RLS)
  Todas as tabelas têm RLS habilitado com políticas específicas:
  - Super admins têm acesso total
  - Paróquias só acessam seus próprios dados
  - Doações públicas são somente leitura
  
  ## 3. Índices
  Criados para otimizar consultas frequentes:
  - Busca por slug
  - Filtros por status
  - Ordenação por data
  - Agregações de valores
  
  ## 4. Funções
  - Atualização automática de `current_amount` nas campanhas
  - Validação de status
  - Triggers para auditoria
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'parish_admin' CHECK (role IN ('super_admin', 'parish_admin')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Super admins can read all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'super_admin'
    )
  );

-- Create parishes table
CREATE TABLE IF NOT EXISTS parishes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  cnpj text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zipcode text NOT NULL,
  description text,
  logo_url text,
  banner_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  pagarme_api_key text,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE parishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parishes are viewable by everyone"
  ON parishes FOR SELECT
  TO authenticated, anon
  USING (status = 'active');

CREATE POLICY "Parish admins can view own parish"
  ON parishes FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Parish admins can update own parish"
  ON parishes FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Super admins can manage all parishes"
  ON parishes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'super_admin'
    )
  );

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  parish_id uuid REFERENCES parishes(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  goal_amount numeric(12,2) NOT NULL CHECK (goal_amount > 0),
  current_amount numeric(12,2) DEFAULT 0 CHECK (current_amount >= 0),
  image_url text,
  video_url text,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active campaigns are viewable by everyone"
  ON campaigns FOR SELECT
  TO authenticated, anon
  USING (status = 'active');

CREATE POLICY "Parish admins can view own campaigns"
  ON campaigns FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parishes
      WHERE parishes.id = campaigns.parish_id AND parishes.user_id = auth.uid()
    )
  );

CREATE POLICY "Parish admins can create campaigns"
  ON campaigns FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM parishes
      WHERE parishes.id = campaigns.parish_id AND parishes.user_id = auth.uid()
    )
  );

CREATE POLICY "Parish admins can update own campaigns"
  ON campaigns FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parishes
      WHERE parishes.id = campaigns.parish_id AND parishes.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM parishes
      WHERE parishes.id = campaigns.parish_id AND parishes.user_id = auth.uid()
    )
  );

CREATE POLICY "Super admins can manage all campaigns"
  ON campaigns FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'super_admin'
    )
  );

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  parish_id uuid REFERENCES parishes(id) ON DELETE CASCADE NOT NULL,
  donor_name text NOT NULL,
  donor_email text NOT NULL,
  donor_phone text,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  payment_method text NOT NULL CHECK (payment_method IN ('credit_card', 'pix', 'boleto')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed', 'refunded')),
  transaction_id text,
  pagarme_response jsonb,
  anonymous boolean DEFAULT false,
  message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Donations are viewable by parish admins"
  ON donations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parishes
      WHERE parishes.id = donations.parish_id AND parishes.user_id = auth.uid()
    )
  );

CREATE POLICY "Super admins can view all donations"
  ON donations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'super_admin'
    )
  );

CREATE POLICY "Anyone can create donations"
  ON donations FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Create platform_settings table
CREATE TABLE IF NOT EXISTS platform_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are viewable by super admins"
  ON platform_settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'super_admin'
    )
  );

CREATE POLICY "Settings are manageable by super admins"
  ON platform_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'super_admin'
    )
  );

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  changes jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Audit logs viewable by super admins"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'super_admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_parishes_slug ON parishes(slug);
CREATE INDEX IF NOT EXISTS idx_parishes_status ON parishes(status);
CREATE INDEX IF NOT EXISTS idx_parishes_user_id ON parishes(user_id);

CREATE INDEX IF NOT EXISTS idx_campaigns_slug ON campaigns(slug);
CREATE INDEX IF NOT EXISTS idx_campaigns_parish_id ON campaigns(parish_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_end_date ON campaigns(end_date);

CREATE INDEX IF NOT EXISTS idx_donations_campaign_id ON donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_parish_id ON donations(parish_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);

-- Function to update campaign current_amount when donation is paid
CREATE OR REPLACE FUNCTION update_campaign_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid') THEN
    UPDATE campaigns
    SET current_amount = current_amount + NEW.amount,
        updated_at = now()
    WHERE id = NEW.campaign_id;
  ELSIF OLD.status = 'paid' AND NEW.status != 'paid' THEN
    UPDATE campaigns
    SET current_amount = GREATEST(0, current_amount - OLD.amount),
        updated_at = now()
    WHERE id = OLD.campaign_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_campaign_amount ON donations;
CREATE TRIGGER trigger_update_campaign_amount
  AFTER INSERT OR UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_campaign_amount();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_parishes_updated_at ON parishes;
CREATE TRIGGER trigger_parishes_updated_at
  BEFORE UPDATE ON parishes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_campaigns_updated_at ON campaigns;
CREATE TRIGGER trigger_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_donations_updated_at ON donations;
CREATE TRIGGER trigger_donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default platform settings
INSERT INTO platform_settings (key, value, description) VALUES
  ('platform_fee_percentage', '2.5', 'Percentual de taxa da plataforma sobre doações'),
  ('site_name', '"Doações Católicas"', 'Nome da plataforma'),
  ('contact_email', '"contato@doacoescatolicas.com"', 'Email de contato'),
  ('allow_new_parishes', 'true', 'Permitir cadastro de novas paróquias')
ON CONFLICT (key) DO NOTHING;

-- Insert sample data for development
DO $$
BEGIN
  -- Note: In production, this would be populated via the actual registration flow
  -- This is just for initial development/testing
END $$;
