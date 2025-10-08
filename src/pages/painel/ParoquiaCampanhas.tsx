import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Church, Plus, ArrowLeft, ExternalLink, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Campaign {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  goal_amount: number;
  current_amount: number;
  status: string;
  start_date: string;
  end_date: string;
  image_url?: string;
}

interface Parish {
  id: string;
  slug: string;
}

const ParoquiaCampanhas = () => {
  const { profile } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [parish, setParish] = useState<Parish | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadCampaigns();
  }, [profile]);

  const loadCampaigns = async () => {
    if (!profile) return;

    try {
      const { data: parishData, error: parishError } = await supabase
        .from("parishes")
        .select("id, slug")
        .eq("user_id", profile.id)
        .maybeSingle();

      if (parishError) throw parishError;
      setParish(parishData);

      if (parishData) {
        const { data: campaignsData, error: campaignsError } = await supabase
          .from("campaigns")
          .select("*")
          .eq("parish_id", parishData.id)
          .order("created_at", { ascending: false });

        if (campaignsError) throw campaignsError;
        setCampaigns(campaignsData || []);
      }
    } catch (error) {
      console.error("Error loading campaigns:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar campanhas",
        description: "Não foi possível carregar as campanhas.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("campaigns")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Campanha excluída",
        description: "A campanha foi excluída com sucesso.",
      });

      loadCampaigns();
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir campanha",
        description: "Não foi possível excluir a campanha.",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: "Ativa", variant: "default" as const },
      draft: { label: "Rascunho", variant: "secondary" as const },
      paused: { label: "Pausada", variant: "outline" as const },
      completed: { label: "Concluída", variant: "default" as const },
      cancelled: { label: "Cancelada", variant: "destructive" as const },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getProgress = (current: number, goal: number) => {
    return goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-sacred">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-sacred">
      <header className="bg-background border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/painel/paroquia">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <Church className="h-8 w-8 text-primary" />
              <h1 className="font-playfair text-2xl font-bold text-foreground">
                Minhas Campanhas
              </h1>
            </div>
            <Button asChild>
              <Link to="/painel/paroquia/campanhas/nova">
                <Plus className="mr-2 h-4 w-4" />
                Nova Campanha
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {campaigns.length === 0 ? (
          <Card className="max-w-2xl mx-auto shadow-divine">
            <CardHeader className="text-center">
              <Church className="h-16 w-16 text-primary mx-auto mb-4" />
              <CardTitle className="font-playfair text-2xl">Nenhuma campanha criada</CardTitle>
              <CardDescription className="text-base">
                Crie sua primeira campanha para começar a receber doações.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" size="lg">
                <Link to="/painel/paroquia/campanhas/nova">
                  <Plus className="mr-2 h-5 w-5" />
                  Criar Primeira Campanha
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="shadow-divine">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="font-playfair text-xl">{campaign.title}</CardTitle>
                        {getStatusBadge(campaign.status)}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {campaign.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(campaign.current_amount)} / {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(campaign.goal_amount)}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${getProgress(campaign.current_amount, campaign.goal_amount)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getProgress(campaign.current_amount, campaign.goal_amount).toFixed(1)}% atingido
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/campanha/${campaign.slug}`} target="_blank">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Ver Página Pública
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/painel/paroquia/campanhas/${campaign.id}/editar`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. A campanha será permanentemente excluída.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(campaign.id)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <div className="pt-2 border-t text-sm text-muted-foreground">
                      <p>Link: <span className="font-mono text-xs">{window.location.origin}/campanha/{campaign.slug}</span></p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ParoquiaCampanhas;
