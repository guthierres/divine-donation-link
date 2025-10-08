# Sistema SaaS Católico de Campanhas de Doações

Sistema completo para gerenciamento de campanhas de doações para paróquias católicas.

## Funcionalidades Implementadas

### 1. Site Público
- Página inicial com banner e campanhas em destaque
- Listagem de campanhas com busca e filtros
- Página detalhada de cada campanha
- Página pública de cada paróquia

### 2. Autenticação
- Sistema de login e registro
- Integração com Supabase Auth
- Controle de acesso por perfil (super_admin e parish_admin)

### 3. Painel da Paróquia
- Dashboard com estatísticas
- Cadastro e gerenciamento da paróquia
- Criação e gerenciamento de campanhas
- Visualização de doações recebidas
- Configurações de pagamento (Pagar.me)

### 4. Painel do Super Admin
- Dashboard global com estatísticas
- Aprovação de paróquias
- Gerenciamento de todas as campanhas
- Visualização de todas as doações
- Configurações da plataforma

### 5. Sistema de Doações
- Checkout transparente com Pagar.me
- Suporte a cartão de crédito, PIX e boleto
- Webhook para atualização automática de status
- Doações anônimas opcionais

## Banco de Dados

O schema completo foi criado no Supabase com as seguintes tabelas:

- **users**: Usuários do sistema (extends auth.users)
- **parishes**: Paróquias cadastradas
- **campaigns**: Campanhas de doação
- **donations**: Doações realizadas
- **platform_settings**: Configurações globais
- **audit_logs**: Logs de auditoria

### Segurança (RLS)
Todas as tabelas possuem Row Level Security habilitado:
- Paróquias só acessam seus próprios dados
- Super admins têm acesso total
- Dados públicos (campanhas ativas) são visíveis para todos

## Rotas da Aplicação

### Públicas
- `/` - Página inicial
- `/campanhas` - Lista de campanhas
- `/campanha/:slug` - Detalhes da campanha
- `/paroquia/:slug` - Página pública da paróquia
- `/login` - Login
- `/registro` - Cadastro

### Protegidas (Requer Login)
- `/paroquia/cadastro` - Cadastro de paróquia
- `/painel/paroquia` - Dashboard da paróquia
- `/painel/admin` - Dashboard do admin (apenas super_admin)

## Edge Functions

### pagarme-webhook
Webhook para processar notificações do Pagar.me e atualizar status das doações.

URL: `{SUPABASE_URL}/functions/v1/pagarme-webhook`

## Variáveis de Ambiente

As seguintes variáveis já estão configuradas no `.env`:

```
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

## Como Usar

### 1. Primeiro Acesso como Super Admin

Para criar o primeiro super admin, você precisa:

1. Criar uma conta via `/registro`
2. No Supabase, atualizar manualmente o campo `role` para `super_admin` na tabela `users`:

```sql
UPDATE users
SET role = 'super_admin'
WHERE email = 'seu-email@example.com';
```

### 2. Cadastro de Paróquia

1. Criar uma conta via `/registro`
2. Fazer login
3. Acessar `/paroquia/cadastro` e preencher os dados
4. Aguardar aprovação do super admin

### 3. Configurar Pagar.me

Cada paróquia deve configurar sua própria chave API do Pagar.me:

1. Criar conta no Pagar.me (https://pagar.me)
2. Obter a chave da API no dashboard
3. No painel da paróquia, ir em Configurações
4. Inserir a chave API do Pagar.me

### 4. Criar Campanhas

Após aprovação:

1. Acessar o painel da paróquia
2. Clicar em "Criar Nova Campanha"
3. Preencher os dados da campanha
4. Publicar

### 5. Receber Doações

1. Compartilhar o link da campanha
2. Doadores acessam e clicam em "Doar Agora"
3. Preenchem dados e escolhem forma de pagamento
4. O webhook atualiza automaticamente o status
5. Valores são creditados diretamente na conta Pagar.me da paróquia

## Próximos Passos

Para produção, considere:

1. Configurar domínio personalizado
2. Adicionar SSL
3. Configurar emails transacionais (confirmação de doações)
4. Implementar relatórios em PDF
5. Adicionar mais formas de pagamento
6. Implementar doações recorrentes
7. Adicionar gamificação (badges para doadores)
8. Sistema de newsletters
9. Integração com redes sociais
10. Analytics e tracking de conversão

## Suporte

Para dúvidas ou problemas, entre em contato com o suporte técnico.

## Tecnologias Utilizadas

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + Shadcn/UI
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Pagamentos**: Pagar.me
- **Hospedagem**: Vercel (frontend) + Supabase (backend)
