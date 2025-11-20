'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Plus, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { formatarMoeda } from '@/lib/utils-app';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface EstoqueProps {
  onVoltar: () => void;
}

export default function Estoque({ onVoltar }: EstoqueProps) {
  const { produtos, adicionarProduto, atualizarProduto, removerProduto } = useApp();
  const [dialogAberto, setDialogAberto] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);

  // Form state
  const [nome, setNome] = useState('');
  const [custo, setCusto] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('5');

  const limparForm = () => {
    setNome('');
    setCusto('');
    setPreco('');
    setEstoque('');
    setEstoqueMinimo('5');
    setEditando(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dados = {
      nome,
      custoUnitario: parseFloat(custo),
      precoVenda: parseFloat(preco),
      estoque: parseInt(estoque),
      estoqueMinimo: parseInt(estoqueMinimo),
    };

    if (editando) {
      atualizarProduto(editando, dados);
    } else {
      adicionarProduto(dados);
    }

    limparForm();
    setDialogAberto(false);
  };

  const handleEditar = (produto: any) => {
    setNome(produto.nome);
    setCusto(produto.custoUnitario.toString());
    setPreco(produto.precoVenda.toString());
    setEstoque(produto.estoque.toString());
    setEstoqueMinimo(produto.estoqueMinimo.toString());
    setEditando(produto.id);
    setDialogAberto(true);
  };

  const handleRemover = (id: string) => {
    if (confirm('Tem certeza que quer remover este produto?')) {
      removerProduto(id);
    }
  };

  const produtosComAlerta = produtos.filter((p) => p.estoque <= p.estoqueMinimo);
  const produtosOk = produtos.filter((p) => p.estoque > p.estoqueMinimo);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            onClick={onVoltar}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Estoque</h1>
            <p className="text-blue-100 text-sm">Controle seus produtos</p>
          </div>
          <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button
                onClick={limparForm}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                <Plus className="w-5 h-5 mr-2" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editando ? 'Editar produto' : 'Novo produto'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do produto</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Marmita grande"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="custo">Custo (R$)</Label>
                    <Input
                      id="custo"
                      type="number"
                      step="0.01"
                      placeholder="8.50"
                      value={custo}
                      onChange={(e) => setCusto(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preco">Preço (R$)</Label>
                    <Input
                      id="preco"
                      type="number"
                      step="0.01"
                      placeholder="15.00"
                      value={preco}
                      onChange={(e) => setPreco(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estoque">Quantidade</Label>
                    <Input
                      id="estoque"
                      type="number"
                      placeholder="20"
                      value={estoque}
                      onChange={(e) => setEstoque(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minimo">Mínimo</Label>
                    <Input
                      id="minimo"
                      type="number"
                      placeholder="5"
                      value={estoqueMinimo}
                      onChange={(e) => setEstoqueMinimo(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  {editando ? 'Salvar alterações' : 'Adicionar produto'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Alertas */}
        {produtosComAlerta.length > 0 && (
          <Card className="shadow-lg border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Atenção! Estoque baixo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {produtosComAlerta.map((produto) => (
                <div
                  key={produto.id}
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{produto.nome}</p>
                    <p className="text-sm text-gray-600">
                      Só restam {produto.estoque} unidades
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditar(produto)}
                      variant="ghost"
                      size="icon"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Lista de produtos */}
        {produtosOk.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Produtos ({produtosOk.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {produtosOk.map((produto) => (
                <div
                  key={produto.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{produto.nome}</p>
                    <div className="flex gap-4 text-sm text-gray-600 mt-1">
                      <span>Custo: {formatarMoeda(produto.custoUnitario)}</span>
                      <span>Venda: {formatarMoeda(produto.precoVenda)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-base px-3 py-1">
                      {produto.estoque}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => handleEditar(produto)}
                        variant="ghost"
                        size="icon"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleRemover(produto.id)}
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {produtos.length === 0 && (
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center space-y-4 py-8">
                <Package className="w-16 h-16 mx-auto text-gray-400" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Nenhum produto cadastrado
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Comece adicionando seus produtos para controlar o estoque
                  </p>
                  <Button onClick={() => setDialogAberto(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar primeiro produto
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
