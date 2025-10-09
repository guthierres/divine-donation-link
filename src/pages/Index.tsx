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
      <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Igreja Católica"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/70" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <p className="text-sm text-white/90 font-medium">Plataforma oficial de doações católicas</p>
          </div>
          <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-fade-in leading-tight">
            Ajude sua Paróquia a
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400 bg-clip-text text-transparent">Fazer História</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto animate-fade-in leading-relaxed">
            Conecte-se com sua comunidade através de doações transparentes e seguras. Cada contribuição faz a diferença.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-10 py-7 h-auto"
              asChild
            >
              <Link to="/campanhas">
                <Search className="mr-2 h-6 w-6" />
                Encontrar Campanhas
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/95 hover:bg-white border-2 border-white text-slate-900 hover:scale-105 transition-all duration-300 text-lg px-10 py-7 h-auto backdrop-blur"
              asChild
            >
              <Link to="/paroquia/cadastro">
                <Heart className="mr-2 h-6 w-6" />
                Sou Paróquia
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full">
              <p className="text-sm text-blue-700 font-semibold">SIMPLES E SEGURO</p>
            </div>
            <h2 className="font-playfair text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Como Funciona
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Doar para sua paróquia nunca foi tão simples e seguro
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <div className="text-center space-y-6 p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-sky-600 rounded-2xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform">
                <Search className="h-10 w-10 text-white" />
              </div>
              <div className="inline-block px-4 py-1 bg-blue-100 rounded-full">
                <span className="text-sm font-bold text-blue-700">PASSO 1</span>
              </div>
              <h3 className="font-playfair text-2xl font-bold text-slate-900">
                Escolha a Campanha
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Navegue pelas campanhas ativas e escolha a causa que deseja apoiar
              </p>
            </div>

            <div className="text-center space-y-6 p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg -rotate-3 hover:rotate-0 transition-transform">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <div className="inline-block px-4 py-1 bg-sky-100 rounded-full">
                <span className="text-sm font-bold text-sky-700">PASSO 2</span>
              </div>
              <h3 className="font-playfair text-2xl font-bold text-slate-900">
                Faça sua Doação
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Doe de forma segura via cartão, PIX ou boleto bancário
              </p>
            </div>

            <div className="text-center space-y-6 p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <div className="inline-block px-4 py-1 bg-cyan-100 rounded-full">
                <span className="text-sm font-bold text-cyan-700">PASSO 3</span>
              </div>
              <h3 className="font-playfair text-2xl font-bold text-slate-900">
                Acompanhe o Impacto
              </h3>
              <p className="text-slate-600 leading-relaxed">
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
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4 group">
              <div className="font-playfair text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                R$ 2,5M+
              </div>
              <p className="text-lg md:text-xl text-slate-300">
                Arrecadados para as paróquias
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-sky-500 mx-auto rounded-full" />
            </div>
            <div className="space-y-4 group">
              <div className="font-playfair text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                150+
              </div>
              <p className="text-lg md:text-xl text-slate-300">
                Paróquias cadastradas
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-sky-500 to-cyan-500 mx-auto rounded-full" />
            </div>
            <div className="space-y-4 group">
              <div className="font-playfair text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                12.500+
              </div>
              <p className="text-lg md:text-xl text-slate-300">
                Doadores ativos
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-teal-500 mx-auto rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-sky-50 relative">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-[size:60px_60px]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-12 md:p-16">
            <div className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full">
              <p className="text-sm text-white font-bold">CADASTRO GRATUITO</p>
            </div>
            <h2 className="font-playfair text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              É uma Paróquia?
            </h2>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Cadastre sua paróquia gratuitamente e comece a criar campanhas de doação hoje mesmo. Alcance mais fiéis e transforme sua comunidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-10 py-7 h-auto"
                asChild
              >
                <Link to="/paroquia/cadastro">
                  <TrendingUp className="mr-2 h-6 w-6" />
                  Cadastrar Paróquia
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 text-lg px-10 py-7 h-auto"
                asChild
              >
                <Link to="/campanhas">
                  <Search className="mr-2 h-6 w-6" />
                  Ver Campanhas
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
