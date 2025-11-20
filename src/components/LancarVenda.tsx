'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react';
import { formatarMoeda } from '@/lib/utils-app';

interface LancarVendaProps {
  onVoltar: () => void;
}

export default function LancarVenda({ onVoltar }: LancarVendaProps) {
  const { produtos, adicionarVenda } = useApp();
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [sucesso, setSucesso] = useState(false);

  const produto = produtos.find((p) => p.id === produtoSelecionado);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!produto) return;

    const qtd = parseInt(quantidade);
    const valorTotal = produto.precoVenda * qtd;

    adicionarVenda({
      produtoId: produto.id,
      produtoNome: produto.nome,
      quantidade: qtd,
      valorTotal,
    });

    setSucesso(true);
    setTimeout(() => {
      setSucesso(false);
      setProdutoSelecionado('');
      setQuantidade('1');
    }, 2000);
  };

  const valorTotal = produto ? produto.precoVenda * parseInt(quantidade || '0') : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            onClick={onVoltar}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Lançar Venda</h1>
            <p className="text-emerald-100 text-sm">Registre sua venda rapidinho</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {sucesso ? (
          <Card className="shadow-lg border-emerald-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-700 mb-2">
                    Venda registrada! 🎉
                  </h3>
                  <p className="text-gray-600">
                    Sua venda foi lançada e o estoque foi atualizado
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
                Nova venda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="produto">Produto vendido</Label>
                  <Select value={produtoSelecionado} onValueChange={setProdutoSelecionado}>
                    <SelectTrigger id="produto" className="text-lg">
                      <SelectValue placeholder="Escolha o produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {produtos.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                          Nenhum produto cadastrado
                        </div>
                      ) : (
                        produtos.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            <div className="flex justify-between items-center w-full">
                              <span>{p.nome}</span>
                              <span className="text-emerald-600 font-semibold ml-4">
                                {formatarMoeda(p.precoVenda)}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {produto && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Preço unitário:</span>
                      <span className="font-semibold">{formatarMoeda(produto.precoVenda)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Estoque disponível:</span>
                      <span className="font-semibold">{produto.estoque} unidades</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade vendida</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    min="1"
                    max={produto?.estoque || 999}
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    className="text-lg"
                  />
                </div>

                {valorTotal > 0 && (
                  <div className="bg-emerald-50 p-6 rounded-lg border-2 border-emerald-200">
                    <p className="text-sm text-gray-700 mb-2">Valor total da venda:</p>
                    <p className="text-4xl font-bold text-emerald-700">
                      {formatarMoeda(valorTotal)}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!produtoSelecionado || !quantidade || parseInt(quantidade) < 1}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Registrar venda
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {produtos.length === 0 && (
          <Card className="shadow-lg border-orange-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <p className="text-gray-700">
                  Você ainda não tem produtos cadastrados.
                </p>
                <p className="text-sm text-gray-600">
                  Cadastre seus produtos na tela de Estoque para começar a registrar vendas!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
