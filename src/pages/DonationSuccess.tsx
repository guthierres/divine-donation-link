import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import jsPDF from "jspdf";

interface DonationData {
  id: string;
  donor_name: string;
  donor_email: string;
  amount: number;
  payment_method: string;
  transaction_id: string;
  created_at: string;
  campaigns: {
    title: string;
  };
  parishes: {
    name: string;
    city: string;
    state: string;
  };
}

export default function DonationSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState<DonationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const donationId = searchParams.get("donation_id");
    if (donationId) {
      loadDonation(donationId);
    } else {
      navigate("/");
    }
  }, [searchParams, navigate]);

  const loadDonation = async (donationId: string) => {
    try {
      const { data, error } = await supabase
        .from("donations")
        .select(`
          *,
          campaigns (
            title
          ),
          parishes (
            name,
            city,
            state
          )
        `)
        .eq("id", donationId)
        .single();

      if (error) throw error;
      setDonation(data);
    } catch (error) {
      console.error("Error loading donation:", error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (!donation) return;

    const doc = new jsPDF();
    
    // Cabeçalho com gradiente
    doc.setFillColor(245, 227, 178); // Dourado suave
    doc.rect(0, 0, 210, 40, 'F');
    
    // Título
    doc.setFontSize(24);
    doc.setTextColor(101, 84, 192); // Roxo
    doc.text("Comprovante de Doação", 105, 20, { align: "center" });
    
    // Subtítulo
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("Doação Católica - Ajudando sua Paróquia", 105, 30, { align: "center" });
    
    // Informações da doação
    let y = 60;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    
    const addLine = (label: string, value: string) => {
      doc.setFont(undefined, 'bold');
      doc.text(label + ":", 20, y);
      doc.setFont(undefined, 'normal');
      doc.text(value, 80, y);
      y += 10;
    };

    addLine("Doador", donation.donor_name);
    addLine("E-mail", donation.donor_email);
    addLine("Valor", `R$ ${Number(donation.amount).toFixed(2)}`);
    addLine("Método de Pagamento", getPaymentMethodLabel(donation.payment_method));
    addLine("ID da Transação", donation.transaction_id || "N/A");
    addLine("Data", format(new Date(donation.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }));
    addLine("Campanha", donation.campaigns?.title || "N/A");
    addLine("Paróquia", donation.parishes?.name || "N/A");
    addLine("Localização", `${donation.parishes?.city} - ${donation.parishes?.state}`);
    
    // Mensagem de agradecimento
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(101, 84, 192);
    doc.setFont(undefined, 'bold');
    doc.text("Muito obrigado pela sua contribuição!", 105, y, { align: "center" });
    
    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, 'normal');
    doc.text("Que Deus abençoe sua generosidade!", 105, y, { align: "center" });
    
    // Rodapé
    doc.setFillColor(184, 216, 240); // Azul suave
    doc.rect(0, 270, 210, 27, 'F');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text("Este comprovante foi gerado eletronicamente.", 105, 280, { align: "center" });
    doc.text(format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }), 105, 287, { align: "center" });
    
    // Salvar PDF
    doc.save(`comprovante-doacao-${donation.id}.pdf`);
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      credit_card: "Cartão de Crédito",
      pix: "PIX",
      boleto: "Boleto",
    };
    return labels[method as keyof typeof labels] || method;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-slate-50 flex items-center justify-center">
        <p className="text-lg text-slate-600">Carregando...</p>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-slate-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center shadow-xl">
          <p className="text-lg text-slate-700">Doação não encontrada</p>
          <Button onClick={() => navigate("/")} className="mt-4 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700">
            Voltar ao Início
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-slate-50 flex items-center justify-center p-4">
      <Card className="p-6 md:p-8 max-w-2xl w-full bg-white shadow-2xl border-slate-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mb-4 shadow-lg">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-slate-900 mb-2">
            Doação Confirmada!
          </h1>
          <p className="text-base md:text-lg text-slate-600">
            Muito obrigado pela sua contribuição!
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 md:p-6 mb-6 space-y-3 border border-slate-200">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 text-sm md:text-base">Valor doado:</span>
            <span className="font-bold text-lg md:text-xl text-emerald-600">
              R$ {Number(donation.amount).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600 text-sm md:text-base">Método de pagamento:</span>
            <span className="font-semibold text-slate-900 text-sm md:text-base">
              {getPaymentMethodLabel(donation.payment_method)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600 text-sm md:text-base">Data:</span>
            <span className="font-semibold text-slate-900 text-sm md:text-base">
              {format(new Date(donation.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-slate-600 text-sm md:text-base">Campanha:</span>
            <span className="font-semibold text-slate-900 text-sm md:text-base text-right max-w-[60%]">
              {donation.campaigns?.title}
            </span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-slate-600 text-sm md:text-base">Paróquia:</span>
            <span className="font-semibold text-slate-900 text-sm md:text-base text-right max-w-[60%]">
              {donation.parishes?.name}
            </span>
          </div>
          {donation.transaction_id && (
            <div className="flex justify-between items-center">
              <span className="text-slate-600 text-sm md:text-base">ID da transação:</span>
              <span className="font-mono text-xs md:text-sm text-slate-900">
                {donation.transaction_id}
              </span>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6 mb-6 text-center">
          <p className="text-sm md:text-base text-slate-700 italic leading-relaxed">
            "Cada um contribua conforme determinou em seu coração, não com pesar ou por obrigação,
            pois Deus ama quem dá com alegria."
          </p>
          <p className="text-xs md:text-sm text-blue-600 font-semibold mt-2">2 Coríntios 9:7</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={generatePDF}
            className="flex-1 h-12 text-base border-2 border-slate-300 hover:bg-slate-50"
            variant="outline"
          >
            <Download className="mr-2 h-5 w-5" />
            Baixar Comprovante
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="flex-1 h-12 text-base bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 shadow-lg hover:shadow-xl transition-all"
          >
            <Home className="mr-2 h-5 w-5" />
            Voltar ao Início
          </Button>
        </div>
      </Card>
    </div>
  );
}
