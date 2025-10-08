import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, QrCode, FileText, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string;
  parishId: string;
  campaignTitle: string;
}

const CheckoutDialog = ({ open, onOpenChange, campaignId, parishId, campaignTitle }: CheckoutDialogProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "pix" | "boleto">("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const [donorData, setDonorData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
    message: "",
    anonymous: false,
  });

  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const handleDonorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDonorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsProcessing(true);

    try {
      const amount = parseFloat(donorData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Valor inválido");
      }

      const { error: donationError } = await supabase.from("donations").insert({
        campaign_id: campaignId,
        parish_id: parishId,
        donor_name: donorData.name,
        donor_email: donorData.email,
        donor_phone: donorData.phone,
        amount,
        payment_method: paymentMethod,
        status: "pending",
        anonymous: donorData.anonymous,
        message: donorData.message || null,
      });

      if (donationError) throw donationError;

      toast({
        title: "Doação iniciada!",
        description: paymentMethod === "pix"
          ? "Aguardando pagamento do PIX..."
          : paymentMethod === "boleto"
          ? "Boleto gerado com sucesso!"
          : "Processando pagamento...",
      });

      setDonorData({
        name: "",
        email: "",
        phone: "",
        amount: "",
        message: "",
        anonymous: false,
      });
      setCardData({
        number: "",
        name: "",
        expiry: "",
        cvv: "",
      });

      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Erro ao processar doação");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-playfair text-2xl">Fazer uma Doação</DialogTitle>
          <DialogDescription>{campaignTitle}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Seus Dados</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                name="name"
                value={donorData.name}
                onChange={handleDonorChange}
                required
                disabled={isProcessing}
                placeholder="Seu nome completo"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={donorData.email}
                  onChange={handleDonorChange}
                  required
                  disabled={isProcessing}
                  placeholder="seu@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={donorData.phone}
                  onChange={handleDonorChange}
                  disabled={isProcessing}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor da Doação (R$)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="1"
                value={donorData.amount}
                onChange={handleDonorChange}
                required
                disabled={isProcessing}
                placeholder="0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensagem (opcional)</Label>
              <Textarea
                id="message"
                name="message"
                value={donorData.message}
                onChange={handleDonorChange}
                disabled={isProcessing}
                placeholder="Deixe uma mensagem de apoio..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={donorData.anonymous}
                onCheckedChange={(checked) =>
                  setDonorData((prev) => ({ ...prev, anonymous: checked === true }))
                }
                disabled={isProcessing}
              />
              <Label htmlFor="anonymous" className="cursor-pointer">
                Fazer doação anônima
              </Label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Forma de Pagamento</h3>

            <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="credit_card">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Cartão
                </TabsTrigger>
                <TabsTrigger value="pix">
                  <QrCode className="h-4 w-4 mr-2" />
                  PIX
                </TabsTrigger>
                <TabsTrigger value="boleto">
                  <FileText className="h-4 w-4 mr-2" />
                  Boleto
                </TabsTrigger>
              </TabsList>

              <TabsContent value="credit_card" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Número do Cartão</Label>
                  <Input
                    id="cardNumber"
                    name="number"
                    value={cardData.number}
                    onChange={handleCardChange}
                    placeholder="0000 0000 0000 0000"
                    disabled={isProcessing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Nome no Cartão</Label>
                  <Input
                    id="cardName"
                    name="name"
                    value={cardData.name}
                    onChange={handleCardChange}
                    placeholder="Nome como está no cartão"
                    disabled={isProcessing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardExpiry">Validade</Label>
                    <Input
                      id="cardExpiry"
                      name="expiry"
                      value={cardData.expiry}
                      onChange={handleCardChange}
                      placeholder="MM/AA"
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardCvv">CVV</Label>
                    <Input
                      id="cardCvv"
                      name="cvv"
                      value={cardData.cvv}
                      onChange={handleCardChange}
                      placeholder="000"
                      maxLength={4}
                      disabled={isProcessing}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pix" className="mt-4">
                <div className="p-6 bg-muted rounded-lg text-center space-y-4">
                  <QrCode className="h-32 w-32 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Após confirmar, você receberá o QR Code do PIX para pagamento.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="boleto" className="mt-4">
                <div className="p-6 bg-muted rounded-lg text-center space-y-4">
                  <FileText className="h-32 w-32 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Após confirmar, você receberá o boleto por email e poderá imprimi-lo.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Confirmar Doação"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
