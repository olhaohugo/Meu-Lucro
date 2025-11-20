'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, LogOut, TrendingUp, Package, ShoppingCart, Receipt, Target } from 'lucide-react';
import { formatarMoeda, obterDataHoje } from '@/lib/utils-app';

interface PainelAdminProps {
  onVoltar: () => void;
}

export default function PainelAdmin({ onVoltar }: PainelAdminProps) {
  const { usuario, logout } = useAuth();
  const { vendas, gastos, produtos, config, metas } = useApp();

  const hoje = obterDataHoje();

  // Estatísticas gerais
  const totalVendas = vendas.reduce((acc, v) => acc + v.valorTotal, 0);
  const totalGastos = gastos.reduce((acc, g) => acc + g.valor, 0);
  const lucroTotal = totalVendas - totalGastos;

  // Estatísticas do mês
  const mesAtual = hoje.substring(0, 7); // YYYY-MM
  const vendasMes = vendas.filter((v) => v.data.startsWith(mesAtual));
  const gastosMes = gastos.filter((g) => g.data.startsWith(mesAtual));
  const totalVendasMes = vendasMes.reduce((acc, v) => acc + v.valorTotal, 0);
  const totalGastosMes = gastosMes.reduce((acc, g) => acc + g.valor, 0);
  const lucroMes = totalVendasMes - totalGastosMes;

  // Produto mais vendido
  const vendasPorProduto = vendas.reduce((acc, v) => {
    acc[v.produtoNome] = (acc[v.produtoNome] || 0) + v.quantidade;
    return acc;
  }, {} as Record<string, number>);

  const produtoMaisVendido = Object.entries(vendasPorProduto).sort((a, b) => b[1] - a[1])[0];

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={onVoltar}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Painel Administrativo</h1>
              <p className="text-purple-100 text-sm">Visão geral do negócio</p>
            </div>
          </div>

          {/* Info do usuário */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-full">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">{usuario?.nome}</p>
                    <p className="text-sm text-purple-100">
                      {usuario?.celular.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Resumo do negócio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Resumo Geral
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Vendas</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatarMoeda(totalVendas)}
                </p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Gastos</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatarMoeda(totalGastos)}
                </p>
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Lucro Total</p>
              <p className={`text-3xl font-bold ${lucroTotal >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatarMoeda(lucroTotal)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas do mês */}
        <Card>
          <CardHeader>
            <CardTitle>Mês Atual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Vendas</span>
              <span className="font-semibold text-emerald-600">
                {formatarMoeda(totalVendasMes)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Gastos</span>
              <span className="font-semibold text-red-600">
                {formatarMoeda(totalGastosMes)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm font-semibold">Lucro do Mês</span>
              <span className={`font-bold ${lucroMes >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatarMoeda(lucroMes)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Informações do negócio */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Negócio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Nome da empresa</span>
              <span className="font-semibold">{usuario?.nomeEmpresa || 'Não definido'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Nome do negócio</span>
              <span className="font-semibold">{config.nomeNegocio || 'Não definido'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tipo de negócio</span>
              <span className="font-semibold">{config.tipoNegocio || 'Não definido'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Custos fixos mensais</span>
              <span className="font-semibold">{formatarMoeda(config.gastosFixosMensais)}</span>
            </div>
            {config.metaDiaria && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Meta diária</span>
                <span className="font-semibold">{formatarMoeda(config.metaDiaria)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
              <p className="text-2xl font-bold">{vendas.length}</p>
              <p className="text-xs text-gray-600">Total de Vendas</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Receipt className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <p className="text-2xl font-bold">{gastos.length}</p>
              <p className="text-xs text-gray-600">Total de Gastos</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">{produtos.length}</p>
              <p className="text-xs text-gray-600">Produtos Cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold">{metas.length}</p>
              <p className="text-xs text-gray-600">Metas Definidas</p>
            </CardContent>
          </Card>
        </div>

        {/* Produto mais vendido */}
        {produtoMaisVendido && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🌟 Produto Mais Vendido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="font-semibold">{produtoMaisVendido[0]}</span>
                <span className="text-emerald-600 font-bold">
                  {produtoMaisVendido[1]} vendas
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
