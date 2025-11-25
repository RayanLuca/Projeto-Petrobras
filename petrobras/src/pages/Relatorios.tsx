import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Filter } from 'lucide-react';
import { getMovements, Movement } from '@/services/stockService';
import { toast } from 'sonner';

export default function Relatorios() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [filteredMovements, setFilteredMovements] = useState<Movement[]>([]);
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');

  useEffect(() => {
    loadMovements();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [dateStart, dateEnd, tipoFilter, movements]);

  const loadMovements = () => {
    setMovements(getMovements().reverse());
  };

  const applyFilters = () => {
    let filtered = [...movements];

    if (dateStart) {
      filtered = filtered.filter(m => new Date(m.data) >= new Date(dateStart));
    }

    if (dateEnd) {
      const endDate = new Date(dateEnd);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(m => new Date(m.data) <= endDate);
    }

    if (tipoFilter !== 'todos') {
      filtered = filtered.filter(m => m.tipo === tipoFilter);
    }

    setFilteredMovements(filtered);
  };

  const handleClear = () => {
    setDateStart('');
    setDateEnd('');
    setTipoFilter('todos');
  };

  const handleExport = () => {
    if (filteredMovements.length === 0) {
      toast.error('Nenhum dado para exportar');
      return;
    }

    const csvContent = [
      ['Data', 'Tipo', 'Item', 'Quantidade', 'Responsável', 'Observação'],
      ...filteredMovements.map(m => [
        new Date(m.data).toLocaleString('pt-BR'),
        m.tipo === 'entrada' ? 'Entrada' : 'Saída',
        m.itemNome,
        m.quantidade.toString(),
        m.responsavel,
        m.observacao || '',
      ])
    ].map(row => row.join(';')).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_movimentacoes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success('Relatório exportado com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
        <p className="text-muted-foreground">Visualize e exporte dados de movimentação</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="date-start">Data Inicial</Label>
              <Input
                id="date-start"
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-end">Data Final</Label>
              <Input
                id="date-end"
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo-filter">Tipo de Movimentação</Label>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger id="tipo-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="entrada">Entradas</SelectItem>
                  <SelectItem value="saida">Saídas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={handleClear}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Movimentações ({filteredMovements.length})
            </CardTitle>
            <Button onClick={handleExport} disabled={filteredMovements.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data e Hora</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Observação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhuma movimentação encontrada com os filtros aplicados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        {new Date(movement.data).toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${
                          movement.tipo === 'entrada' ? 'text-success' : 'text-destructive'
                        }`}>
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
