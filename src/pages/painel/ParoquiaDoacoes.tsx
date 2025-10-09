import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Eye, Calendar, DollarSign, CreditCard, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Donation {
  id: string;
  donor_name: string;
  donor_email: string;
  amount: number;
  payment_method: string;
  status: string;
  anonymous: boolean;
  message: string | null;
  created_at: string;
  campaigns: {
    title: string;
  };
}

export default function ParoquiaDoacoes() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "paid" | "processing" | "pending" | "failed" | "refunded">("all");

  useEffect(() => {
    loadDonations();
  }, [filter]);

  const loadDonations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: parish } = await supabase
        .from("parishes")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!parish) return;

      let query = supabase
        .from("donations")
        .select(`
          *,
          campaigns (
            title
          )
        `)
        .eq("parish_id", parish.id)
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      console.error("Error loading donations:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as doações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
      case "processing":
        return "bg-amber-500/10 text-amber-700 border-amber-500/20";
      case "failed":
        return "bg-rose-500/10 text-rose-700 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-700 border-slate-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      paid: "Paga",
      processing: "Processando",
      pending: "Pendente",
      failed: "Falhou",
      refunded: "Reembolsada",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      credit_card: "Cartão de Crédito",
      pix: "PIX",
      boleto: "Boleto",
    };
    return labels[method as keyof typeof labels] || method;
  };

  const totalDonations = donations.reduce((sum, d) => sum + Number(d.amount), 0);
  const paidDonations = donations.filter(d => d.status === "paid");
  const totalPaid = paidDonations.reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <div className="min-h-screen bg-gradient-sacred">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/painel/paroquia")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Painel
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-serif text-foreground mb-2">Doações Recebidas</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todas as doações da sua paróquia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Arrecadado</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {totalPaid.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <CreditCard className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Doações Confirmadas</p>
                <p className="text-2xl font-bold text-foreground">
                  {paidDonations.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <User className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Doações</p>
                <p className="text-2xl font-bold text-foreground">
                  {donations.length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 mb-6">
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              size="sm"
            >
              Todas
            </Button>
            <Button
              variant={filter === "paid" ? "default" : "outline"}
              onClick={() => setFilter("paid")}
              size="sm"
            >
              Pagas
            </Button>
            <Button
              variant={filter === "processing" ? "default" : "outline"}
              onClick={() => setFilter("processing")}
              size="sm"
            >
              Processando
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              onClick={() => setFilter("pending")}
              size="sm"
            >
              Pendentes
            </Button>
          </div>
        </Card>

        {loading ? (
          <Card className="p-12 text-center bg-card/50 backdrop-blur-sm">
            <p className="text-muted-foreground">Carregando doações...</p>
          </Card>
        ) : donations.length === 0 ? (
          <Card className="p-12 text-center bg-card/50 backdrop-blur-sm">
            <p className="text-muted-foreground">Nenhuma doação encontrada</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <Card
                key={donation.id}
                className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-sacred transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-foreground">
                        {donation.anonymous ? "Doador Anônimo" : donation.donor_name}
                      </h3>
                      <Badge className={getStatusColor(donation.status)}>
                        {getStatusLabel(donation.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Campanha: {donation.campaigns?.title}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        R$ {Number(donation.amount).toFixed(2)}
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        {getPaymentMethodLabel(donation.payment_method)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(donation.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    {donation.message && (
                      <p className="mt-3 text-sm italic text-muted-foreground border-l-2 border-primary/30 pl-3">
                        "{donation.message}"
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/painel/paroquia/doacao/${donation.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
