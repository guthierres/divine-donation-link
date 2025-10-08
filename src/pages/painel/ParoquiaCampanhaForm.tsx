import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Parish {
  id: string;
  name: string;
}

const ParoquiaCampanhaForm = () => {
  const { id } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [parish, setParish] = useState<Parish | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    goal_amount: "",
    image_url: "",
    video_url: "",
    end_date: "",
    status: "draft",
  });

  useEffect(() => {
    loadParish();
    if (id) {
      loadCampaign();
    }
  }, [profile, id]);

  const loadParish = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from("parishes")
        .select("id, name")
        .eq("user_id", profile.id)
        .maybeSingle();

      if (error) throw error;
      setParish(data);
    } catch (error) {
      console.error("Error loading parish:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os dados da paróquia.",
      });
    }
  };

  const loadCampaign = async () => {
    try {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title,
          slug: data.slug,
          description: data.description,
          category: data.category,
          goal_amount: data.goal_amount.toString(),
          image_url: data.image_url || "",
          video_url: data.video_url || "",
          end_date: data.end_date ? new Date(data.end_date).toISOString().split("T")[0] : "",
          status: data.status,
        });
      }
    } catch (error) {
      console.error("Error loading campaign:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar a campanha.",
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!parish) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Paróquia não encontrada.",
      });
      return;
    }

    setLoading(true);

    try {
      const campaignData = {
        parish_id: parish.id,
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        category: formData.category,
        goal_amount: parseFloat(formData.goal_amount),
        image_url: formData.image_url || null,
        video_url: formData.video_url || null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        status: formData.status,
      };

      if (id) {
        const { error } = await supabase
          .from("campaigns")
          .update(campaignData)
          .eq("id", id);

        if (error) throw error;

        toast({
          title: "Campanha atualizada",
          description: "A campanha foi atualizada com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from("campaigns")
          .insert([campaignData]);

        if (error) throw error;

        toast({
          title: "Campanha criada",
          description: "A campanha foi criada com sucesso.",
        });
      }

      navigate("/painel/paroquia/campanhas");
    } catch (error: any) {
      console.error("Error saving campaign:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar campanha",
        description: error.message || "Não foi possível salvar a campanha.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sacred">
      <header className="bg-background border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/painel/paroquia/campanhas">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="font-playfair text-2xl font-bold text-foreground">
              {id ? "Editar Campanha" : "Nova Campanha"}
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="shadow-divine">
          <CardHeader>
            <CardTitle className="font-playfair">Informações da Campanha</CardTitle>
            <CardDescription>
              Preencha os dados da sua campanha de arrecadação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Campanha *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ex: Reforma do Telhado da Igreja"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Link da Campanha (gerado automaticamente)</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                    /campanha/
                  </span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    className="rounded-l-none"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  URL completa: {window.location.origin}/campanha/{formData.slug}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva os objetivos e necessidades da campanha..."
                  rows={6}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reforma">Reforma e Manutenção</SelectItem>
                      <SelectItem value="construcao">Construção</SelectItem>
                      <SelectItem value="pastoral">Pastoral e Evangelização</SelectItem>
                      <SelectItem value="caridade">Obras de Caridade</SelectItem>
                      <SelectItem value="equipamentos">Equipamentos e Material</SelectItem>
                      <SelectItem value="eventos">Eventos e Celebrações</SelectItem>
                      <SelectItem value="educacao">Educação</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal_amount">Meta de Arrecadação (R$) *</Label>
                  <Input
                    id="goal_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.goal_amount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, goal_amount: e.target.value }))}
                    placeholder="10000.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">URL da Imagem</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Recomendado: imagem em alta qualidade (mínimo 1200x630px)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video_url">URL do Vídeo (opcional)</Label>
                <Input
                  id="video_url"
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, video_url: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="end_date">Data de Término (opcional)</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="paused">Pausada</SelectItem>
                      <SelectItem value="completed">Concluída</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Salvando..." : id ? "Atualizar Campanha" : "Criar Campanha"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to="/painel/paroquia/campanhas">Cancelar</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ParoquiaCampanhaForm;
