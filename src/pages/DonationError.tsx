import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, Home, RotateCcw } from "lucide-react";

export default function DonationError() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get("message") || "Ocorreu um erro ao processar sua doação";

  return (
    <div className="min-h-screen bg-gradient-sacred flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full bg-card/50 backdrop-blur-sm border-border/50 shadow-divine text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-500/10 rounded-full mb-4">
          <XCircle className="h-12 w-12 text-rose-600" />
        </div>
        
        <h1 className="text-3xl font-serif text-foreground mb-2">
          Ops! Algo deu errado
        </h1>
        
        <p className="text-muted-foreground mb-6">
          {errorMessage}
        </p>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-foreground">
            Não se preocupe! Nenhum valor foi cobrado. 
            Por favor, tente novamente ou entre em contato conosco se o problema persistir.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Tentar Novamente
          </Button>
          <Button
            onClick={() => navigate("/")}
          >
            <Home className="mr-2 h-4 w-4" />
            Voltar ao Início
          </Button>
        </div>
      </Card>
    </div>
  );
}
