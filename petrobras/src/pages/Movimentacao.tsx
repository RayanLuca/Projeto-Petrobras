import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowDownCircle, ArrowUpCircle, History } from 'lucide-react';
import { getStockItems, getMovements, createMovement, Movement, StockItem } from '@/services/stockService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Movimentacao() {
  const { user } = useAuth();
  const [items, setItems] = useState<StockItem[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [observacao, setObservacao] = useState('');
  const [tipo, setTipo] = useState<'entrada' | 'saida'>('entrada');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setItems(getStockItems());
    setMovements(getMovements().reverse());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedItemId || !quantidade) {
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

    if (tipo === 'saida' && selectedItem.quantidade < qtd) {
      toast.error('Quantidade insuficiente em estoque');
      return;
    }

    createMovement({
      itemId: selectedItemId,
      itemNome: selectedItem.nome,
      tipo,
      quantidade: qtd,
      responsavel: user?.name || 'Usuário',
      observacao,
    });

    toast.success(`${tipo === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso!`);
    
    // Reset form
    setSelectedItemId('');
    setQuantidade('');
    setObservacao('');
    
    loadData();
  };

  const handleClear = () => {
    setSelectedItemId('');
    setQuantidade('');
    setObservacao('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Movimentação</h1>
        <p className="text-muted-foreground">Registre entradas e saídas de estoque</p>
      </div>

      <Tabs value={tipo} onValueChange={(v) => setTipo(v as 'entrada' | 'saida')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="entrada">
            <ArrowUpCircle className="mr-2 h-4 w-4" />
            Nova Entrada
          </TabsTrigger>
          <TabsTrigger value="saida">
            <ArrowDownCircle className="mr-2 h-4 w-4" />
            Nova Saída
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entrada" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registrar Entrada</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="item-entrada">Item *</Label>
                    <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                      <SelectTrigger id="item-entrada">
                        <SelectValue placeholder="Selecione o item" />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.codigo} - {item.nome} (Estoque: {item.quantidade})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantidade-entrada">Quantidade *</Label>
                    <Input
                      id="quantidade-entrada"
                      type="number"
                      min="1"
                      placeholder="0"
                      value={quantidade}
                      onChange={(e) => setQuantidade(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacao-entrada">Observação</Label>
                  <Textarea
                    id="observacao-entrada"
                    placeholder="Informações adicionais sobre a entrada..."
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={handleClear}>
                    Limpar
                  </Button>
                  <Button type="submit">
                    <ArrowUpCircle className="mr-2 h-4 w-4" />
                    Registrar Entrada
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saida" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registrar Saída</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="item-saida">Item *</Label>
                    <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                      <SelectTrigger id="item-saida">
                        <SelectValue placeholder="Selecione o item" />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.codigo} - {item.nome} (Estoque: {item.quantidade})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantidade-saida">Quantidade *</Label>
                    <Input
                      id="quantidade-saida"
                      type="number"
                      min="1"
                      placeholder="0"
                      value={quantidade}
                      onChange={(e) => setQuantidade(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacao-saida">Observação</Label>
                  <Textarea
                    id="observacao-saida"
                    placeholder="Informações adicionais sobre a saída..."
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={handleClear}>
                    Limpar
                  </Button>
                  <Button type="submit" variant="destructive">
                    <ArrowDownCircle className="mr-2 h-4 w-4" />
                    Registrar Saída
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Movimentações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Observação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhuma movimentação registrada
                    </TableCell>
                  </TableRow>
                ) : (
                  movements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        {new Date(movement.data).toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1 font-medium ${
                          movement.tipo === 'entrada' ? 'text-success' : 'text-destructive'
                        }`}>
                          {movement.tipo === 'entrada' ? (
                            <ArrowUpCircle className="h-4 w-4" />
                          ) : (
                            <ArrowDownCircle className="h-4 w-4" />
                          )}
                          {movement.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{movement.itemNome}</TableCell>
                      <TableCell>
                        <span className={movement.tipo === 'entrada' ? 'text-success' : 'text-destructive'}>
                          {movement.tipo === 'entrada' ? '+' : '-'}{movement.quantidade}
                        </span>
                      </TableCell>
                      <TableCell>{movement.responsavel}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {movement.observacao || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
