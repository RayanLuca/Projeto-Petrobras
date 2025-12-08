import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { getStockItems, createRequest, StockItem } from '@/services/stockService';
import { useAuth } from '@/contexts/AuthContext';

export default function SolicitacaoPecas() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState<StockItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    setItems(getStockItems());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedItemId || !quantidade || !user?.matricula) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const qtd = parseInt(quantidade);
    if (qtd <= 0) {
      toast.error('Quantidade deve ser maior que zero');
      return;
    }

    const selectedItem = items.find(item => item.id === selectedItemId);
    if (!selectedItem) {
      toast.error('Item não encontrado');
      return;
    }

    createRequest({
      itemId: selectedItemId,
      itemNome: selectedItem.nome,
      quantidade: qtd,
      solicitante: user.name,
      matricula: user.matricula,
      observacao,
    });

    toast.success('Solicitação enviada com sucesso!');
    navigate('/dashboard');
  };

  const handleClear = () => {
    setSelectedItemId('');
    setQuantidade('');
    setObservacao('');
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Solicitação de Peças</h1>
        <p className="text-muted-foreground">
          Solicite a redistribuição de peças do estoque
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nova Solicitação</CardTitle>
          <CardDescription>
            Preencha os dados da solicitação. Ela será analisada pela equipe de gestão de estoque.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="solicitante">Solicitante</Label>
                <Input
                  id="solicitante"
                  value={user?.name || ''}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="matricula">Matrícula</Label>
                <Input
                  id="matricula"
                  value={user?.matricula || ''}
                  disabled
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="item">Item Solicitado *</Label>
                <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                  <SelectTrigger id="item">
                    <SelectValue placeholder="Selecione o item" />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.codigo} - {item.nome} (Disponível: {item.quantidade})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="quantidade">Quantidade Solicitada *</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="1"
                  placeholder="0"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="observacao">Justificativa / Observação</Label>
                <Textarea
                  id="observacao"
                  placeholder="Descreva o motivo da solicitação..."
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="button" variant="secondary" onClick={handleClear}>
                Limpar
              </Button>
              <Button type="submit">
                Enviar Solicitação
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
