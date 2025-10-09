import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Campanhas from "./pages/Campanhas";
import CampanhaDetalhe from "./pages/CampanhaDetalhe";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import CadastroParoquia from "./pages/CadastroParoquia";
import ParoquiaPublica from "./pages/ParoquiaPublica";
import DonationSuccess from "./pages/DonationSuccess";
import DonationError from "./pages/DonationError";
import NotFound from "./pages/NotFound";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import TermosUso from "./pages/TermosUso";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/campanhas" element={<Campanhas />} />
            <Route path="/campanha/:slug" element={<CampanhaDetalhe />} />
            <Route path="/paroquia/:slug" element={<ParoquiaPublica />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/paroquia/cadastro" element={<ProtectedRoute><CadastroParoquia /></ProtectedRoute>} />
            <Route path="/doacao/sucesso" element={<DonationSuccess />} />
            <Route path="/doacao/erro" element={<DonationError />} />
            <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/termos-uso" element={<TermosUso />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
