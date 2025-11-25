import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Estoque from "./pages/Estoque";
import Movimentacao from "./pages/Movimentacao";
import CadastroPecas from "./pages/CadastroPecas";
import SolicitacaoPecas from "./pages/SolicitacaoPecas";
import Relatorios from "./pages/Relatorios";
import NotFound from "./pages/NotFound";
import AcompanharSolicitacoes from "./pages/AcompanharSolicitacoes";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
            <Route path="/estoque" element={<ProtectedRoute><Layout><Estoque /></Layout></ProtectedRoute>} />
            <Route path="/movimentacao" element={<ProtectedRoute><Layout><Movimentacao /></Layout></ProtectedRoute>} />
            <Route path="/cadastro-pecas" element={<ProtectedRoute><Layout><CadastroPecas /></Layout></ProtectedRoute>} />
            <Route path="/solicitacao-pecas" element={<ProtectedRoute><Layout><SolicitacaoPecas /></Layout></ProtectedRoute>} />
            <Route path="/relatorios" element={<ProtectedRoute><Layout><Relatorios /></Layout></ProtectedRoute>} />
            <Route
  path="/acompanhar-solicitacoes"
  element={
    <ProtectedRoute>
      <Layout>
        <AcompanharSolicitacoes />
      </Layout>
    </ProtectedRoute>
  }
/>

            <Route path="*" element={<NotFound />} />
            

          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
