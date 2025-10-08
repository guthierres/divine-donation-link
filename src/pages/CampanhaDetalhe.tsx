import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutDialog from "@/components/CheckoutDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Heart,
  Share2,
  Calendar,
  Target,
  Users,
  Church,
  TrendingUp,
} from "lucide-react";

interface CampaignData {
  id: string;
  title: string;
  description: string;
  category: string;
  parish: string;
  parishId: string;
  location: string;
  address: string;
  image: string;
  currentAmount: number;
  goalAmount: number;
  donorsCount: number;
  daysLeft: number;
  createdAt: string;
}

const CampanhaDetalhe = () => {
  const { slug } = useParams();
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    loadCampaign();
  }, [slug]);

  const loadCampaign = async () => {
    try {
      const { data: campaignData, error: campaignError } = await supabase
        .from("campaigns")
        .select(`
          *,
          parishes (
            id,
            name,
            city,
            state,
            address
          )
        `)
        .eq("slug", slug)
        .eq("status", "active")
        .maybeSingle();

      if (campaignError) throw campaignError;

      if (campaignData) {
        const { count: donorsCount } = await supabase
          .from("donations")
          .select("*", { count: "exact", head: true })
          .eq("campaign_id", campaignData.id)
          .eq("status", "paid");

        const endDate = new Date(campaignData.end_date);
        const today = new Date();
        const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

        setCampaign({
          id: campaignData.id,
          title: campaignData.title,
          description: campaignData.description,
          category: campaignData.category,
          parish: campaignData.parishes?.name || "Paróquia",
          parishId: campaignData.parish_id,
          location: `${campaignData.parishes?.city || ""}, ${campaignData.parishes?.state || ""}`,
          address: campaignData.parishes?.address || "",
          image: campaignData.image_url || "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200&q=80",
          currentAmount: Number(campaignData.current_amount) || 0,
          goalAmount: Number(campaignData.goal_amount) || 0,
          donorsCount: donorsCount || 0,
          daysLeft,
          createdAt: campaignData.created_at,
        });
      }
    } catch (error) {
      console.error("Error loading campaign:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Church className="h-16 w-16 text-muted-foreground mx-auto" />
            <h1 className="font-playfair text-3xl font-bold">Campanha não encontrada</h1>
            <p className="text-muted-foreground">A campanha que você procura não existe ou não está mais ativa.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const sampleCampaign = {
    id: "1",
    title: "Reforma do Telhado da Igreja Matriz",
    parish: "Paróquia Sagrada Família",
    location: "São Paulo, SP",
    address: "Rua das Flores, 123 - Centro, São Paulo - SP",
    image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200&q=80",
    description: `A Igreja Matriz da Paróquia Sagrada Família, construída há mais de 80 anos, necessita urgentemente de reforma em seu telhado. Com o passar dos anos e as intempéries, surgiram várias infiltrações que estão comprometendo a estrutura do templo e colocando em risco o patrimônio histórico e artístico da nossa comunidade.

A reforma contemplará:
- Substituição completa das telhas deterioradas
- Reforço da estrutura de madeira
- Impermeabilização adequada
- Instalação de calhas e rufos novos
- Pintura e acabamento

Esta é uma obra essencial para preservar nosso patrimônio religioso e garantir que nossa comunidade possa continuar celebrando a fé com segurança e dignidade.

Contamos com a generosidade de todos os fiéis e amigos da paróquia para tornar este projeto realidade. Cada doação, por menor que seja, faz diferença e será aplicada com total transparência.`,
    currentAmount: 45000,
    goalAmount: 100000,
    donorsCount: 234,
    daysLeft: 45,
    createdAt: "2024-01-15",
    category: "Infraestrutura",
  };

  const percentage = Math.min(
    (campaign.currentAmount / campaign.goalAmount) * 100,
    100
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <Header />

      {/* Hero Image */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </section>

      {/* Campaign Content */}
      <section className="py-12 -mt-32 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-divine">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-primary text-primary-foreground">
                        {campaign.category}
                      </Badge>
                      <Badge variant="outline">Ativa</Badge>
                    </div>

                    <h1 className="font-playfair text-3xl md:text-4xl font-bold text-foreground">
                      {campaign.title}
                    </h1>

                    <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Church className="h-4 w-4" />
                        <span>{campaign.parish}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{campaign.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Criada em {formatDate(campaign.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="prose max-w-none">
                    <div className="text-foreground/90 whitespace-pre-line leading-relaxed">
                      {campaign.description}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Parish Info */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="font-playfair text-2xl font-semibold text-foreground">
                    Sobre a Paróquia
                  </h2>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-foreground">
                        {campaign.parish}
                      </p>
                      <p className="text-muted-foreground">{campaign.address}</p>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Church className="mr-2 h-4 w-4" />
                      Ver Todas as Campanhas desta Paróquia
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Donation Widget */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 shadow-divine">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="font-playfair text-3xl font-bold text-primary">
                          {formatCurrency(campaign.currentAmount)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          de {formatCurrency(campaign.goalAmount)}
                        </span>
                      </div>
                      <Progress value={percentage} className="h-3" />
                      <p className="text-sm text-muted-foreground">
                        {percentage.toFixed(0)}% da meta atingida
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="text-center space-y-1">
                        <div className="flex items-center justify-center gap-1">
                          <Heart className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-foreground text-lg">
                            {campaign.donorsCount}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Doadores</p>
                      </div>
                      <div className="text-center space-y-1">
                        <div className="flex items-center justify-center gap-1">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-foreground text-lg">
                            {campaign.daysLeft}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Dias restantes</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sacred"
                      onClick={() => setCheckoutOpen(true)}
                    >
                      <Heart className="mr-2 h-5 w-5" />
                      Fazer uma Doação
                    </Button>

                    <Button size="lg" variant="outline" className="w-full">
                      <Share2 className="mr-2 h-5 w-5" />
                      Compartilhar
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Meta</p>
                        <p className="text-muted-foreground">
                          {formatCurrency(campaign.goalAmount)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Arrecadado
                        </p>
                        <p className="text-muted-foreground">
                          {formatCurrency(campaign.currentAmount)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Doadores
                        </p>
                        <p className="text-muted-foreground">
                          {campaign.donorsCount} pessoas
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        campaignId={campaign.id}
        parishId={campaign.parishId}
        campaignTitle={campaign.title}
      />
    </div>
  );
};

export default CampanhaDetalhe;
