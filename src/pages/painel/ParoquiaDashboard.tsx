import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Church, TrendingUp, Heart, Plus, ExternalLink, Settings, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Parish {
  id: string;
  name: string;
  slug: string;
  status: string;
}

interface Stats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalRaised: number;
  totalDonors: number;
}

const ParoquiaDashboard = () => {
  const { profile, signOut } = useAuth();
  const [parish, setParish] = useState<Parish | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalRaised: 0,
    totalDonors: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, [profile]);

  const loadDashboardData = async () => {
    if (!profile) return;

    try {
      const { data: parishData, error: parishError } = await supabase
        .from("parishes")
        .select("*")
        .eq("user_id", profile.id)
        .maybeSingle();

      if (parishError) throw parishError;
      setParish(parishData);

      if (parishData) {
        const { data: campaigns, error: campaignsError } = await supabase
          .from("campaigns")
          .select("id, status, current_amount")
          .eq("parish_id", parishData.id);

        if (campaignsError) throw campaignsError;

        const { data: donations, error: donationsError } = await supabase
          .from("donations")
          .select("donor_email, status")
          .eq("parish_id", parishData.id)
          .eq("status", "paid");

        if (donationsError) throw donationsError;

        const totalRaised = campaigns?.reduce((sum, c) => sum + Number(c.current_amount || 0), 0) || 0;
        const uniqueDonors = new Set(donations?.map((d) => d.donor_email)).size;

        setStats({
          totalCampaigns: campaigns?.length || 0,
          activeCampaigns: campaigns?.filter((c) => c.status === "active").length || 0,
          totalRaised,
          totalDonors: uniqueDonors,
        });
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do painel.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
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
        <Card className="max-w-2xl w-full shadow-divine">
          <CardHeader className="text-center">
            <Church className="h-16 w-16 text-primary mx-auto mb-4" />
            <CardTitle className="font-playfair text-3xl">Bem-vindo!</CardTitle>
            <CardDescription className="text-base">
              Você ainda não cadastrou sua paróquia. Comece agora para criar campanhas e receber doações.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full" size="lg">
              <Link to="/paroquia/cadastro">
                <Plus className="mr-2 h-5 w-5" />
                Cadastrar Paróquia
              </Link>
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Church className="h-8 w-8 text-primary" />
              <div>
                <h1 className="font-playfair text-2xl font-bold text-foreground">
                  {parish.name}
                </h1>
                <Badge variant={parish.status === "active" ? "default" : "secondary"}>
                  {parish.status === "active" ? "Ativa" : parish.status === "pending" ? "Pendente" : "Inativa"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link to={`/paroquia/${parish.slug}`} target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ver Página Pública
                </Link>
              </Button>
              <Button variant="ghost" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {parish.status === "pending" && (
          <Card className="mb-8 border-yellow-500 bg-yellow-50">
            <CardContent className="p-6">
              <p className="text-yellow-800">
                Seu cadastro está em análise. Você receberá um email quando for aprovado pelos administradores da plataforma.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Arrecadado
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(stats.totalRaised)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Campanhas Ativas
              </CardTitle>
              <Church className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.activeCampaigns}
              </div>
              <p className="text-xs text-muted-foreground">
                de {stats.totalCampaigns} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Doadores
              </CardTitle>
              <Heart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.totalDonors}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Campanhas
              </CardTitle>
              <Settings className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.totalCampaigns}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-divine">
            <CardHeader>
              <CardTitle className="font-playfair">Ações Rápidas</CardTitle>
              <CardDescription>Gerencie suas campanhas e configurações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start" size="lg" disabled={parish.status !== "active"}>
                <Link to="/painel/paroquia/campanhas/nova">
                  <Plus className="mr-2 h-5 w-5" />
                  Criar Nova Campanha
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start" size="lg">
                <Link to="/painel/paroquia/campanhas">
                  <Church className="mr-2 h-5 w-5" />
                  Ver Minhas Campanhas
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start" size="lg">
                <Link to="/painel/paroquia/doacoes">
                  <Heart className="mr-2 h-5 w-5" />
                  Ver Doações Recebidas
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start" size="lg">
                <Link to="/painel/paroquia/configuracoes">
                  <Settings className="mr-2 h-5 w-5" />
                  Configurações
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-divine">
            <CardHeader>
              <CardTitle className="font-playfair">Informações</CardTitle>
              <CardDescription>Dicas e avisos importantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Configure sua chave Pagar.me</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Para receber doações, você precisa configurar sua chave da API Pagar.me nas configurações.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/painel/paroquia/configuracoes">
                    Configurar Agora
                  </Link>
                </Button>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Compartilhe suas campanhas</h3>
                <p className="text-sm text-muted-foreground">
                  Divulgue o link da sua página e das campanhas nas redes sociais para alcançar mais doadores.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ParoquiaDashboard;
