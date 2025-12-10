// src/pages/AcompanharSolicitacoes.tsx
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getRequests, updateRequestStatus } from "@/services/stockService";
import type { SolicitacaoPeca } from "@/services/stockService";

export default function AcompanharSolicitacoes() {
  const [requests, setRequests] = useState<SolicitacaoPeca[]>([]);

  useEffect(() => {
    setRequests(getRequests());
  }, []);

  const refresh = () => setRequests(getRequests());

  const handleStatus = (id: string, status: "aprovada" | "rejeitada") => {
    const ok = updateRequestStatus(id, status);
    if (ok === false) {
      toast.error("Não foi possível atualizar o status.");
      return;
    }
    toast.success(`Solicitação ${status}`);
    refresh();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aprovada":
        return <Badge className="bg-green-600">Aprovada</Badge>;
      case "rejeitada":
        return <Badge className="bg-red-600">Rejeitada</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pendente</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      <div>
        <h1 className="text-3xl font-bold">Acompanhar Solicitações</h1>
        <p className="text-muted-foreground mt-1">
          Visualize todas as solicitações e aprove/rejeite as pendentes.
        </p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-muted-foreground">Nenhuma solicitação encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center gap-2">
                  <span className="truncate">{req.itemNome} — {req.quantidade}x</span>
                  <div>{getStatusBadge(req.status)}</div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                <p><strong>Solicitante:</strong> {req.solicitante} ({req.matricula})</p>
                {req.observacao && <p><strong>Observação:</strong> {req.observacao}</p>}
                <p className="text-sm text-muted-foreground">
                  Enviado em: {new Date(req.data).toLocaleString()}
                </p>

                {req.status === "pendente" && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={() => handleStatus(req.id, "aprovada")}>
                      Aprovar
                    </Button>
                    <Button variant="destructive" onClick={() => handleStatus(req.id, "rejeitada")}>
                      Rejeitar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
