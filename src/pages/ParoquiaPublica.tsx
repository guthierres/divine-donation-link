import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CampaignCard from "@/components/CampaignCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Church } from "lucide-react";

interface Parish {
  id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  logo_url?: string;
  banner_url?: string;
}

interface Campaign {
  id: string;
  title: string;
  slug: string;
  parish: string;
  location: string;
  image: string;
  currentAmount: number;
  goalAmount: number;
  donorsCount: number;
}

const ParoquiaPublica = () => {
  const { slug } = useParams();
  const [parish, setParish] = useState<Parish | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParishData();
  }, [slug]);

  const loadParishData = async () => {
    try {
      const { data: parishData, error: parishError } = await supabase
        .from("parishes")
        .select("*")
        .eq("slug", slug)
        .eq("status", "active")
        .maybeSingle();

      if (parishError) throw parishError;
      setParish(parishData);

      if (parishData) {
        const { data: campaignsData, error: campaignsError } = await supabase
          .from("campaigns")
          .select(`
            id,
            title,
            slug,
            image_url,
            goal_amount,
            current_amount,
            status
          `)
          .eq("parish_id", parishData.id)
          .eq("status", "active");

        if (campaignsError) throw campaignsError;

        const { data: donationsCount } = await supabase
          .from("donations")
          .select("campaign_id, status", { count: "exact" })
          .eq("parish_id", parishData.id)
          .eq("status", "paid");

        const formattedCampaigns = campaignsData?.map((campaign) => ({
          id: campaign.id,
          title: campaign.title,
          slug: campaign.slug,
          parish: parishData.name,
          location: `${parishData.city}, ${parishData.state}`,
          image: campaign.image_url || "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80",
          currentAmount: Number(campaign.current_amount) || 0,
          goalAmount: Number(campaign.goal_amount) || 0,
          donorsCount: donationsCount?.filter((d) => d.campaign_id === campaign.id).length || 0,
        })) || [];

        setCampaigns(formattedCampaigns);
      }
    } catch (error) {
      console.error("Error loading parish:", error);
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

  if (!parish) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Church className="h-16 w-16 text-muted-foreground mx-auto" />
            <h1 className="font-playfair text-3xl font-bold">Paróquia não encontrada</h1>
            <p className="text-muted-foreground">A paróquia que você procura não existe ou não está ativa.</p>
            <Link to="/campanhas" className="text-primary hover:underline">
              Ver todas as campanhas
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section
        className="relative h-80 overflow-hidden"
        style={{
          backgroundImage: parish.banner_url
            ? `url(${parish.banner_url})`
            : "url(https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </section>

      <section className="py-12 -mt-32 relative z-10">
        <div className="container mx-auto px-4">
          <Card className="shadow-divine mb-8">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {parish.logo_url && (
                  <img
                    src={parish.logo_url}
                    alt={parish.name}
                    className="w-32 h-32 object-contain bg-white rounded-lg p-2"
                  />
                )}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge>Paróquia Ativa</Badge>
                    </div>
                    <h1 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-2">
                      {parish.name}
                    </h1>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{parish.address}, {parish.city} - {parish.state}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{parish.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{parish.email}</span>
                    </div>
                  </div>

                  {parish.description && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-foreground/90 whitespace-pre-line leading-relaxed">
                        {parish.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-8">
            <h2 className="font-playfair text-3xl font-bold text-foreground mb-2">
              Campanhas Ativas
            </h2>
            <p className="text-muted-foreground">
              Apoie as causas desta paróquia
            </p>
          </div>

          {campaigns.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} {...campaign} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Church className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Esta paróquia ainda não possui campanhas ativas.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ParoquiaPublica;
