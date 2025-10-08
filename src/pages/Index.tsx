import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CampaignCard from "@/components/CampaignCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Search, Shield, TrendingUp, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-church.jpg";

const Index = () => {
  // Sample campaigns data - will be replaced with real data later
  const featuredCampaigns = [
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
  ];

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Igreja Católica"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/40" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Ajude sua <span className="text-primary">Paróquia</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in">
            Plataforma de doações para comunidades católicas. Transparência, segurança e fé.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-divine text-lg px-8"
              asChild
            >
              <Link to="/campanhas">
                <Search className="mr-2 h-5 w-5" />
                Encontrar Campanhas
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white text-white hover:bg-white hover:text-foreground text-lg px-8 backdrop-blur"
              asChild
            >
              <Link to="/paroquia/cadastro">
                <Heart className="mr-2 h-5 w-5" />
                Sou Paróquia
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gradient-sacred">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
              Como Funciona
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Doar para sua paróquia nunca foi tão simples e seguro
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6 rounded-lg hover:shadow-sacred transition-shadow">
              <div className="mx-auto w-16 h-16 bg-gradient-holy rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-playfair text-2xl font-semibold text-foreground">
                1. Escolha a Campanha
              </h3>
              <p className="text-muted-foreground">
                Navegue pelas campanhas ativas e escolha a causa que deseja apoiar
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-lg hover:shadow-sacred transition-shadow">
              <div className="mx-auto w-16 h-16 bg-gradient-holy rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-playfair text-2xl font-semibold text-foreground">
                2. Faça sua Doação
              </h3>
              <p className="text-muted-foreground">
                Doe de forma segura via cartão, PIX ou boleto bancário
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-lg hover:shadow-sacred transition-shadow">
              <div className="mx-auto w-16 h-16 bg-gradient-holy rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-playfair text-2xl font-semibold text-foreground">
                3. Acompanhe o Impacto
              </h3>
              <p className="text-muted-foreground">
                Veja em tempo real como sua doação está fazendo a diferença
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-2">
                Campanhas em Destaque
              </h2>
              <p className="text-lg text-muted-foreground">
                Apoie as causas mais urgentes das nossas paróquias
              </p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link to="/campanhas">
                Ver Todas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} {...campaign} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild className="w-full">
              <Link to="/campanhas">
                Ver Todas as Campanhas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-divine">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="font-playfair text-5xl font-bold text-primary">
                R$ 2,5M+
              </div>
              <p className="text-lg text-foreground/80">
                Arrecadados para as paróquias
              </p>
            </div>
            <div className="space-y-2">
              <div className="font-playfair text-5xl font-bold text-primary">
                150+
              </div>
              <p className="text-lg text-foreground/80">
                Paróquias cadastradas
              </p>
            </div>
            <div className="space-y-2">
              <div className="font-playfair text-5xl font-bold text-primary">
                12.500+
              </div>
              <p className="text-lg text-foreground/80">
                Doadores ativos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-sacred">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            É uma Paróquia?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Cadastre sua paróquia gratuitamente e comece a criar campanhas de doação hoje mesmo
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-divine text-lg px-8"
            asChild
          >
            <Link to="/paroquia/cadastro">
              <TrendingUp className="mr-2 h-5 w-5" />
              Cadastrar Paróquia
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
