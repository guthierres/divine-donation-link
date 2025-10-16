import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Church, AlertCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CadastroParoquia = () => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    cnpj: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "name") {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!user) {
      setError("Você precisa estar logado para cadastrar uma paróquia");
      setIsLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase.from("parishes").insert([{
        name: formData.name,
        slug: formData.slug,
        cnpj: formData.cnpj,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        description: formData.description,
        responsible_name: formData.name,
        user_id: user.id,
        status: "pending" as const,
      }]);

      if (insertError) throw insertError;

      toast({
        title: "Paróquia cadastrada com sucesso!",
        description: "Seu cadastro está em análise. Você receberá um email quando for aprovado.",
      });

      navigate("/painel/paroquia");
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar paróquia. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sacred py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Church className="h-8 w-8 text-primary" />
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-foreground">
              Cadastrar Paróquia
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Preencha os dados da sua paróquia para começar a receber doações
          </p>
        </div>

        <Card className="shadow-divine">
          <CardHeader>
            <CardTitle>Informações da Paróquia</CardTitle>
            <CardDescription>
              Todos os campos são obrigatórios. Seu cadastro será analisado antes da aprovação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Paróquia</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Ex: Paróquia Sagrada Família"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Personalizada</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">doacoescatolicas.com/paroquia/</span>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Gerado automaticamente a partir do nome</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      name="cnpj"
                      placeholder="00.000.000/0000-00"
                      value={formData.cnpj}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email da Paróquia</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="contato@paroquia.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Rua, número, bairro"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Cidade"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="UF"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      maxLength={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipcode">CEP</Label>
                    <Input
                      id="zipcode"
                      name="zipcode"
                      placeholder="00000-000"
                      value={formData.zipcode}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição da Paróquia</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Conte um pouco sobre sua paróquia, sua história e missão..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    rows={5}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Cadastrando..." : "Cadastrar Paróquia"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CadastroParoquia;
