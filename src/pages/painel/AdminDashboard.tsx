import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Church, TrendingUp, Heart, Users, CheckCircle, XCircle, LogOut, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Parish {
  id: string;
  name: string;
  slug: string;
  email: string;
  city: string;
  state: string;
  status: string;
  pagarme_configured: boolean;
  created_at: string;
}

interface Stats {
  totalParishes: number;
  activeParishes: number;
  pendingParishes: number;
  totalCampaigns: number;
  totalRaised: number;
  totalDonations: number;
}

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalParishes: 0,
    activeParishes: 0,
    pendingParishes: 0,
    totalCampaigns: 0,
    totalRaised: 0,
    totalDonations: 0,
  });
  const [pendingParishes, setPendingParishes] = useState<Parish[]>([]);
  const [allParishes, setAllParishes] = useState<Parish[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: parishes, error: parishesError } = await supabase
        .from("parishes")
        .select("*");

      if (parishesError) throw parishesError;

      const { data: campaigns, error: campaignsError } = await supabase
        .from("campaigns")
        .select("current_amount");

      if (campaignsError) throw campaignsError;

      const { count: donationsCount, error: donationsError } = await supabase
        .from("donations")
        .select("*", { count: "exact", head: true })
        .eq("status", "paid");

      if (donationsError) throw donationsError;

      const totalRaised = campaigns?.reduce((sum, c) => sum + Number(c.current_amount || 0), 0) || 0;

      setStats({
        totalParishes: parishes?.length || 0,
        activeParishes: parishes?.filter((p) => p.status === "active").length || 0,
        pendingParishes: parishes?.filter((p) => p.status === "pending").length || 0,
        totalCampaigns: campaigns?.length || 0,
        totalRaised,
        totalDonations: donationsCount || 0,
      });

      setPendingParishes(parishes?.filter((p) => p.status === "pending") || []);
      setAllParishes(parishes || []);
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

  const handleApproveParish = async (parishId: string) => {
    try {
      const { error } = await supabase
        .from("parishes")
        .update({ status: "active" })
        .eq("id", parishId);

      if (error) throw error;

      toast({
        title: "Paróquia aprovada",
        description: "A paróquia foi aprovada com sucesso.",
      });

      loadDashboardData();
    } catch (error) {
      console.error("Error approving parish:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível aprovar a paróquia.",
      });
    }
  };

  const handleRejectParish = async (parishId: string) => {
    try {
      const { error } = await supabase
        .from("parishes")
        .update({ status: "inactive" })
        .eq("id", parishId);

      if (error) throw error;

      toast({
        title: "Paróquia rejeitada",
        description: "A paróquia foi rejeitada.",
      });

      loadDashboardData();
    } catch (error) {
      console.error("Error rejecting parish:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível rejeitar a paróquia.",
      });
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

  return (
    <div className="min-h-screen bg-gradient-sacred">
      <header className="bg-background border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Church className="h-8 w-8 text-primary" />
              <div>
                <h1 className="font-playfair text-2xl font-bold text-foreground">
                  Painel do Administrador
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gerenciamento da plataforma
                </p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
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
                Paróquias Ativas
              </CardTitle>
              <Church className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.activeParishes}
              </div>
              <p className="text-xs text-muted-foreground">
                de {stats.totalParishes} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pendentes
              </CardTitle>
              <Users className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.pendingParishes}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Campanhas
              </CardTitle>
              <Church className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.totalCampaigns}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Doações
              </CardTitle>
              <Heart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.totalDonations}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ticket Médio
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(stats.totalDonations > 0 ? stats.totalRaised / stats.totalDonations : 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-divine">
          <CardHeader>
            <CardTitle className="font-playfair">Gerenciamento de Paróquias</CardTitle>
            <CardDescription>
              Visualize e gerencie todas as paróquias cadastradas na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={pendingParishes.length > 0 ? "pending" : "all"}>
              <TabsList className="mb-4">
                {pendingParishes.length > 0 && (
                  <TabsTrigger value="pending">
                    Pendentes ({pendingParishes.length})
                  </TabsTrigger>
                )}
                <TabsTrigger value="all">
                  Todas ({allParishes.length})
                </TabsTrigger>
                <TabsTrigger value="active">
                  Ativas ({allParishes.filter((p) => p.status === "active").length})
                </TabsTrigger>
              </TabsList>

              {pendingParishes.length > 0 && (
                <TabsContent value="pending">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Localização</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Pagar.me</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingParishes.map((parish) => (
                        <TableRow key={parish.id}>
                          <TableCell className="font-medium">{parish.name}</TableCell>
                          <TableCell>{parish.email}</TableCell>
                          <TableCell>
                            {parish.city}, {parish.state}
                          </TableCell>
                          <TableCell>
                            {new Date(parish.created_at).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell>
                            {parish.pagarme_configured ? (
                              <Badge variant="default" className="bg-green-600">Configurado</Badge>
                            ) : (
                              <Badge variant="secondary">Não configurado</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveParish(parish.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectParish(parish.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Rejeitar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              )}

              <TabsContent value="all">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Pagar.me</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allParishes.map((parish) => (
                      <TableRow key={parish.id}>
                        <TableCell className="font-medium">{parish.name}</TableCell>
                        <TableCell>{parish.email}</TableCell>
                        <TableCell>
                          {parish.city}, {parish.state}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            parish.status === "active" ? "default" :
                            parish.status === "pending" ? "secondary" :
                            "destructive"
                          }>
                            {parish.status === "active" ? "Ativa" :
                             parish.status === "pending" ? "Pendente" : "Inativa"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {parish.pagarme_configured ? (
                            <Badge variant="default" className="bg-green-600">Configurado</Badge>
                          ) : (
                            <Badge variant="secondary">Não configurado</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(parish.created_at).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                          >
                            <a href={`/paroquia/${parish.slug}`} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="active">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Pagar.me</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allParishes.filter((p) => p.status === "active").map((parish) => (
                      <TableRow key={parish.id}>
                        <TableCell className="font-medium">{parish.name}</TableCell>
                        <TableCell>{parish.email}</TableCell>
                        <TableCell>
                          {parish.city}, {parish.state}
                        </TableCell>
                        <TableCell>
                          {parish.pagarme_configured ? (
                            <Badge variant="default" className="bg-green-600">Configurado</Badge>
                          ) : (
                            <Badge variant="secondary">Não configurado</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(parish.created_at).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                          >
                            <a href={`/paroquia/${parish.slug}`} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
