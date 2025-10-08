import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CampaignCard from "@/components/CampaignCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Campanhas = () => {
  // Sample campaigns data - will be replaced with real data later
  const campaigns = [
    {
      id: "1",
      title: "Reforma do Telhado da Igreja Matriz",
      parish: "Paróquia Sagrada Família",
      location: "São Paulo, SP",
      image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80",
      currentAmount: 45000,
      goalAmount: 100000,
      donorsCount: 234,
      slug: "reforma-telhado-sagrada-familia",
    },
    {
      id: "2",
      title: "Cestas Básicas para Famílias Carentes",
      parish: "Paróquia São José Operário",
      location: "Rio de Janeiro, RJ",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
      currentAmount: 12500,
      goalAmount: 20000,
      donorsCount: 156,
      slug: "cestas-basicas-sao-jose",
    },
    {
      id: "3",
      title: "Construção da Nova Capela",
      parish: "Paróquia Nossa Senhora Aparecida",
      location: "Belo Horizonte, MG",
      image: "https://images.unsplash.com/photo-1478476868527-002ae3f3e159?w=800&q=80",
      currentAmount: 78000,
      goalAmount: 150000,
      donorsCount: 412,
      slug: "construcao-capela-aparecida",
    },
    {
      id: "4",
      title: "Compra de Instrumentos para o Coral",
      parish: "Paróquia Santa Teresinha",
      location: "Curitiba, PR",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      currentAmount: 8500,
      goalAmount: 15000,
      donorsCount: 89,
      slug: "instrumentos-coral-teresinha",
    },
    {
      id: "5",
      title: "Reforma da Creche Paroquial",
      parish: "Paróquia São Pedro",
      location: "Porto Alegre, RS",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
      currentAmount: 32000,
      goalAmount: 60000,
      donorsCount: 278,
      slug: "reforma-creche-sao-pedro",
    },
    {
      id: "6",
      title: "Evangelização nas Comunidades",
      parish: "Paróquia Santo Antônio",
      location: "Salvador, BA",
      image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&q=80",
      currentAmount: 5200,
      goalAmount: 10000,
      donorsCount: 67,
      slug: "evangelizacao-santo-antonio",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-sacred py-16 border-b border-border/40">
        <div className="container mx-auto px-4">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
            Campanhas Ativas
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Encontre e apoie campanhas de doação das paróquias católicas de todo o Brasil
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-background border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por paróquia, cidade ou causa..."
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sp">São Paulo</SelectItem>
                <SelectItem value="rj">Rio de Janeiro</SelectItem>
                <SelectItem value="mg">Minas Gerais</SelectItem>
                <SelectItem value="pr">Paraná</SelectItem>
                <SelectItem value="rs">Rio Grande do Sul</SelectItem>
                <SelectItem value="ba">Bahia</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais Recentes</SelectItem>
                <SelectItem value="urgent">Mais Urgentes</SelectItem>
                <SelectItem value="progress">Maior Progresso</SelectItem>
                <SelectItem value="amount">Maior Arrecadação</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="hidden md:flex">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Mais Filtros
            </Button>
          </div>
        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="py-12 flex-1">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-muted-foreground">
              Exibindo <span className="font-semibold text-foreground">{campaigns.length}</span> campanhas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} {...campaign} />
            ))}
          </div>

          {/* Pagination would go here */}
          <div className="mt-12 flex justify-center">
            <p className="text-muted-foreground">
              Mostrando todas as campanhas disponíveis
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Campanhas;
