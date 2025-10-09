import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, Home, RotateCcw } from "lucide-react";

export default function DonationError() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get("message") || "Ocorreu um erro ao processar sua doação";

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-slate-50 flex items-center justify-center p-4">
      <Card className="p-6 md:p-8 max-w-md w-full bg-white shadow-2xl border-slate-200 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-500 to-red-600 rounded-full mb-4 shadow-lg">
          <XCircle className="h-12 w-12 text-white" />
        </div>

        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-slate-900 mb-3">
          Ops! Algo deu errado
        </h1>

        <p className="text-base md:text-lg text-slate-600 mb-6">
          {errorMessage}
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-6 mb-6">
          <p className="text-sm md:text-base text-slate-700 leading-relaxed">
            Não se preocupe! Nenhum valor foi cobrado.
            Por favor, tente novamente ou entre em contato conosco se o problema persistir.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="h-12 text-base border-2 border-slate-300 hover:bg-slate-50"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Tentar Novamente
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="h-12 text-base bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 shadow-lg hover:shadow-xl transition-all"
          >
            <Home className="mr-2 h-5 w-5" />
            Voltar ao Início
          </Button>
        </div>
      </Card>
    </div>
  );
}
