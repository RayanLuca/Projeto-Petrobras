import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { createStockItem, updateStockItem, getStockItem, StockItem } from '@/services/stockService';

const categorias = [
  'Periféricos',
  'Cabos',
  'Hardware',
  'Software',
  
];

const unidades = ['UN', 'KG', 'M', 'L', 'CX'];

export default function CadastroPecas() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [unidade, setUnidade] = useState('UN');
  const [localizacao, setLocalizacao] = useState('');
  const [valorUnitario, setValorUnitario] = useState('');

  useEffect(() => {
    if (editId) {
      const item = getStockItem(editId);
      if (item) {
        setCodigo(item.codigo);
        setNome(item.nome);
        setCategoria(item.categoria);
        setQuantidade(item.quantidade.toString());
        setUnidade(item.unidade);
        setLocalizacao(item.localizacao);
        setValorUnitario(item.valorUnitario.toString());
      }
    }
  }, [editId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!codigo || !nome || !categoria || !quantidade || !localizacao || !valorUnitario) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const qtd = parseInt(quantidade);
    const valor = parseFloat(valorUnitario);

    if (qtd < 0 || valor < 0) {
      toast.error('Valores devem ser positivos');
      return;
    }

    const itemData = {
      codigo,
      nome,
      categoria,
      quantidade: qtd,
      unidade,
      localizacao,
      valorUnitario: valor,
    };

    if (editId) {
      updateStockItem(editId, itemData);
      toast.success('Item atualizado com sucesso!');
    } else {
      createStockItem(itemData);
      toast.success('Item cadastrado com sucesso!');
    }

    navigate('/estoque');
  };

  const handleClear = () => {
    setCodigo('');
    setNome('');
    setCategoria('');
    setQuantidade('');
    setUnidade('UN');
    setLocalizacao('');
    setValorUnitario('');
  };

  const handleCancel = () => {
    navigate('/estoque');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {editId ? 'Editar Peça' : 'Cadastro de Peças'}
        </h1>
        <p className="text-muted-foreground">
          {editId ? 'Atualize as informações da peça' : 'Adicione uma nova peça ao estoque'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Peça</CardTitle>
          <CardDescription>
            Preencha todos os campos obrigatórios marcados com *
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código *</Label>
                <Input
                  id="codigo"
                  placeholder="PC001"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  disabled={!!editId}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  placeholder="Nome da peça"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger id="categoria">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="localizacao">Localização *</Label>
                <Input
                  id="localizacao"
                  placeholder="A1-P3"
                  value={localizacao}
                  onChange={(e) => setLocalizacao(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade *</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade *</Label>
                <Select value={unidade} onValueChange={setUnidade}>
                  <SelectTrigger id="unidade">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {unidades.map((un) => (
                      <SelectItem key={un} value={un}>
                        {un}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="valor">Valor Unitário (R$) *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={valorUnitario}
                  onChange={(e) => setValorUnitario(e.target.value)}
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
                {editId ? 'Atualizar' : 'Salvar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
