import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Church, ArrowLeft, Save, Key, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Parish {
  id: string;
  name: string;
  logo_url: string | null;
  cover_url: string | null;
  icon_url: string | null;
  pagarme_secret_key: string | null;
  pagarme_configured: boolean;
  infinitepay_configured?: boolean;
  infinitepay_api_key?: string | null;
}

const ParoquiaConfiguracoes = () => {
  const { profile } = useAuth();
  const [parish, setParish] = useState<Parish | null>(null);
  const [secretKey, setSecretKey] = useState("");
  const [infinitepayApiKey, setInfinitepayApiKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadParishData();
  }, [profile]);

  const loadParishData = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from("parishes")
        .select("id, name, logo_url, cover_url, icon_url, pagarme_secret_key, pagarme_configured, infinitepay_api_key, infinitepay_configured")
        .eq("user_id", profile.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setParish(data);
        setSecretKey(data.pagarme_secret_key ? "••••••••••••••••" : "");
        setInfinitepayApiKey(data.infinitepay_api_key ? "••••••••••••••••" : "");
      }
    } catch (error) {
      console.error("Error loading parish:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as configurações.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!parish) return;

    const hasNewSecretKey = secretKey && secretKey !== "••••••••••••••••";
    const hasNewInfinitepayKey = infinitepayApiKey && infinitepayApiKey !== "••••••••••••••••";

    if (!hasNewSecretKey && !hasNewInfinitepayKey && !parish.pagarme_configured && !parish.infinitepay_configured) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Configure pelo menos um método de pagamento.",
      });
      return;
    }

    setSaving(true);

    try {
      const updateData: any = {};
      
      if (hasNewSecretKey) {
        updateData.pagarme_secret_key = secretKey;
        updateData.pagarme_configured = true;
      }
      
      if (hasNewInfinitepayKey) {
        updateData.infinitepay_api_key = infinitepayApiKey;
        updateData.infinitepay_configured = true;
      }

      const { error } = await supabase
        .from("parishes")
        .update(updateData)
        .eq("id", parish.id);

      if (error) throw error;

      toast({
        title: "Configurações salvas!",
        description: "Sua paróquia está pronta para receber doações.",
      });

      navigate("/painel/paroquia");
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-sacred">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!parish) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-sacred p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <CardTitle>Paróquia não encontrada</CardTitle>
            <CardDescription>
              Você precisa cadastrar sua paróquia primeiro.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/paroquia/cadastro">Cadastrar Paróquia</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-sacred">
      <header className="bg-background border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/painel/paroquia">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <Church className="h-8 w-8 text-primary" />
            <div>
              <h1 className="font-playfair text-2xl font-bold text-foreground">
                Configurações
              </h1>
              <p className="text-sm text-muted-foreground">{parish.name}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="shadow-divine">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-playfair text-2xl">Configuração do Pagar.me</CardTitle>
                <CardDescription>
                  Configure suas chaves da API para começar a receber doações
                </CardDescription>
              </div>
              {parish.pagarme_configured && (
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Configurado
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Pagar.me Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Key className="h-5 w-5" />
                Pagar.me
              </h3>
              <Alert>
                <AlertDescription>
                  Configure o Pagar.me para aceitar cartões de crédito, PIX e boleto.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="secretKey">Chave Secreta (Secret Key)</Label>
                <Input
                  id="secretKey"
                  type="password"
                  placeholder="sk_live_..."
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground">
                  Encontre em <a href="https://dashboard.pagar.me" target="_blank" rel="noopener noreferrer" className="underline">dashboard.pagar.me</a> → Configurações → Chaves de API
                </p>
              </div>
            </div>

            <Separator />

            {/* InfinitePay Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Key className="h-5 w-5" />
                InfinitePay
              </h3>
              <Alert>
                <AlertDescription>
                  Configure o InfinitePay para aceitar pagamentos via link de checkout.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="infinitepayApiKey">Chave de API (API Key)</Label>
                <Input
                  id="infinitepayApiKey"
                  type="password"
                  placeholder="infinitepay_..."
                  value={infinitepayApiKey}
                  onChange={(e) => setInfinitepayApiKey(e.target.value)}
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground">
                  Encontre em <a href="https://www.infinitepay.io/desenvolvedores" target="_blank" rel="noopener noreferrer" className="underline">infinitepay.io/desenvolvedores</a>
                </p>
              </div>
            </div>

            <Separator />

            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-foreground">Como obter suas chaves:</h3>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Acesse o <a href="https://dashboard.pagar.me" target="_blank" rel="noopener noreferrer" className="underline">painel do Pagar.me</a></li>
                <li>Faça login com sua conta</li>
                <li>Vá em "Configurações" &gt; "Chaves de API"</li>
                <li>Copie suas chaves e cole nos campos acima</li>
              </ol>
              <p className="text-xs text-muted-foreground italic">
                Importante: Use chaves de produção (live) para receber doações reais.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Webhook do Pagar.me</h3>
              <p className="text-sm text-yellow-700 mb-2">
                Configure o seguinte URL no painel do Pagar.me para receber notificações de pagamento:
              </p>
              <code className="block bg-yellow-100 p-2 rounded text-xs text-yellow-900 break-all">
                {import.meta.env.VITE_SUPABASE_URL}/functions/v1/pagarme-webhook
              </code>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saving} size="lg">
                <Save className="mr-2 h-5 w-5" />
                {saving ? "Salvando..." : "Salvar Configurações"}
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/painel/paroquia">Cancelar</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ParoquiaConfiguracoes;
