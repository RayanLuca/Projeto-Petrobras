import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, TrendingUp, TrendingDown, DollarSign, Plus, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStockMetrics, getMovements, Movement } from '@/services/stockService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalItems: 0,
    totalValue: 0,
    entradas: 0,
    saidas: 0,
    itemsCount: 0,
  });
  const [recentMovements, setRecentMovements] = useState<Movement[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const data = getStockMetrics();
    setMetrics(data);

    const movements = getMovements();
    setRecentMovements(movements.slice(-5).reverse());

    // Prepare chart data for last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const chartDataMap = last7Days.map(date => {
      const dayMovements = movements.filter(m => m.data.startsWith(date));
      return {
        data: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        entradas: dayMovements.filter(m => m.tipo === 'entrada').reduce((sum, m) => sum + m.quantidade, 0),
        saidas: dayMovements.filter(m => m.tipo === 'saida').reduce((sum, m) => sum + m.quantidade, 0),
      };
    });

    setChartData(chartDataMap);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema de estoque</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/cadastro-pecas')}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cadastro
          </Button>
          <Button variant="secondary" onClick={() => navigate('/solicitacao-pecas')}>
            <ClipboardList className="mr-2 h-4 w-4" />
            Solicitar Redistribuição
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Estoque Atual</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {metrics.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor total em estoque
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quantidade Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.itemsCount} itens diferentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Entradas (30 dias)</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{metrics.entradas}</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saídas (30 dias)</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{metrics.saidas}</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Movimentação - Últimos 7 Dias</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="entradas" fill="hsl(var(--success))" name="Entradas" />
                <Bar dataKey="saidas" fill="hsl(var(--destructive))" name="Saídas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movimentações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMovements.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhuma movimentação recente
                </p>
              ) : (
                recentMovements.map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-3">
                      {movement.tipo === 'entrada' ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{movement.itemNome}</p>
                        <p className="text-xs text-muted-foreground">
                          {movement.responsavel} - {new Date(movement.data).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${movement.tipo === 'entrada' ? 'text-success' : 'text-destructive'}`}>
                        {movement.tipo === 'entrada' ? '+' : '-'}{movement.quantidade}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
