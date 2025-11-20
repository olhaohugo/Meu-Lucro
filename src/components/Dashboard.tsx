'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatarMoeda, obterDataHoje, calcularProgressoMeta } from '@/lib/utils-app';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  AlertTriangle,
  Calculator,
  Users,
  Target,
  Bot,
  ShoppingCart,
  Receipt,
  Edit2,
  Check,
  X,
  Settings,
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tela: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { vendas, gastos, produtos, config, metas, conquistas, definirMeta, atualizarConfig } = useApp();
  const { usuario } = useAuth();
  const [editandoMeta, setEditandoMeta] = useState(false);
  const [novaMetaDiaria, setNovaMetaDiaria] = useState('');

  const hoje = obterDataHoje();

  // Calcular totais do dia
  const vendasHoje = vendas
    .filter((v) => v.data.startsWith(hoje))
    .reduce((acc, v) => acc + v.valorTotal, 0);

  const gastosHoje = gastos
    .filter((g) => g.data.startsWith(hoje))
    .reduce((acc, g) => acc + g.valor, 0);

  const lucroHoje = vendasHoje - gastosHoje;

  // Meta diária
  const metaDiaria = config.metaDiaria || 0;
  const progressoMetaDiaria = metaDiaria > 0 ? calcularProgressoMeta(vendasHoje, metaDiaria) : 0;

  // Meta semanal
  const inicioSemana = new Date();
  inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
  const inicioSemanaStr = inicioSemana.toISOString().split('T')[0];
  
  const vendasSemana = vendas
    .filter((v) => v.data >= inicioSemanaStr)
    .reduce((acc, v) => acc + v.valorTotal, 0);
  
  const metaSemanal = metaDiaria * 7;
  const progressoMetaSemanal = metaSemanal > 0 ? calcularProgressoMeta(vendasSemana, metaSemanal) : 0;

  // Meta mensal
  const mesAtual = hoje.substring(0, 7);
  const vendasMes = vendas
    .filter((v) => v.data.startsWith(mesAtual))
    .reduce((acc, v) => acc + v.valorTotal, 0);
  
  const metaMensal = metaDiaria * 30;
  const progressoMetaMensal = metaMensal > 0 ? calcularProgressoMeta(vendasMes, metaMensal) : 0;

  // Alertas de estoque
  const alertasEstoque = produtos.filter((p) => p.estoque <= p.estoqueMinimo);

  // Conquistas recentes
  const conquistasDesbloqueadas = conquistas.filter((c) => c.desbloqueada);

  const handleSalvarMeta = () => {
    const valor = parseFloat(novaMetaDiaria);
    if (isNaN(valor) || valor <= 0) {
      alert('Digite um valor válido!');
      return;
    }

    atualizarConfig({ metaDiaria: valor });
    setEditandoMeta(false);
    setNovaMetaDiaria('');
  };

  const handleCancelarEdicao = () => {
    setEditandoMeta(false);
    setNovaMetaDiaria('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-bold">
              Olá, {usuario?.nomeEmpresa || 'empreendedor'}! 👋
            </h1>
            <Button
              onClick={() => onNavigate('admin')}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>
          <p className="text-emerald-100">
            {config.nomeNegocio || 'Seu negócio'} • {hoje.split('-').reverse().join('/')}
          </p>
        </div>
      </div>

      {/* Cards principais */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 space-y-4">
        {/* Resumo financeiro do dia */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Resumo de hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Entrou</p>
                <p className="text-lg font-bold text-emerald-600">
                  {formatarMoeda(vendasHoje)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Saiu</p>
                <p className="text-lg font-bold text-red-600">{formatarMoeda(gastosHoje)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Lucro</p>
                <p
                  className={`text-lg font-bold ${
                    lucroHoje >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {formatarMoeda(lucroHoje)}
                </p>
              </div>
            </div>

            {/* Indicador de operação */}
            <div
              className={`p-3 rounded-lg flex items-center gap-3 ${
                lucroHoje >= 0
                  ? 'bg-emerald-50 border border-emerald-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              {lucroHoje >= 0 ? (
                <>
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-emerald-700">Você está no lucro! 🎉</p>
                    <p className="text-xs text-emerald-600">
                      Continue assim, tá indo bem!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <TrendingDown className="w-6 h-6 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-700">Atenção! ⚠️</p>
                    <p className="text-xs text-red-600">
                      Você gastou mais do que vendeu hoje
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Metas - Diária, Semanal e Mensal */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Metas
              </CardTitle>
              {!editandoMeta && metaDiaria > 0 && (
                <Button
                  onClick={() => {
                    setEditandoMeta(true);
                    setNovaMetaDiaria(metaDiaria.toString());
                  }}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Editar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Edição de meta */}
            {editandoMeta ? (
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                <Label htmlFor="nova-meta">Nova meta diária</Label>
                <Input
                  id="nova-meta"
                  type="number"
                  placeholder="Ex: 500"
                  value={novaMetaDiaria}
                  onChange={(e) => setNovaMetaDiaria(e.target.value)}
                  className="text-lg"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSalvarMeta}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                  <Button
                    onClick={handleCancelarEdicao}
                    variant="outline"
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : metaDiaria > 0 ? (
              <>
                {/* Meta Diária */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">📅 Meta do Dia</span>
                    <span className="text-sm font-semibold">
                      {formatarMoeda(vendasHoje)} / {formatarMoeda(metaDiaria)}
                    </span>
                  </div>
                  <Progress value={progressoMetaDiaria} className="h-2" />
                  <p className="text-xs text-gray-600">
                    {progressoMetaDiaria >= 100
                      ? '🎉 Meta batida! Tá voando!'
                      : `Faltam ${formatarMoeda(metaDiaria - vendasHoje)} pra bater a meta`}
                  </p>
                </div>

                {/* Meta Semanal */}
                <div className="space-y-2 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">📊 Meta da Semana</span>
                    <span className="text-sm font-semibold">
                      {formatarMoeda(vendasSemana)} / {formatarMoeda(metaSemanal)}
                    </span>
                  </div>
                  <Progress value={progressoMetaSemanal} className="h-2" />
                  <p className="text-xs text-gray-600">
                    {progressoMetaSemanal >= 100
                      ? '🔥 Meta semanal batida!'
                      : `Faltam ${formatarMoeda(metaSemanal - vendasSemana)} esta semana`}
                  </p>
                </div>

                {/* Meta Mensal */}
                <div className="space-y-2 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">📈 Meta do Mês</span>
                    <span className="text-sm font-semibold">
                      {formatarMoeda(vendasMes)} / {formatarMoeda(metaMensal)}
                    </span>
                  </div>
                  <Progress value={progressoMetaMensal} className="h-2" />
                  <p className="text-xs text-gray-600">
                    {progressoMetaMensal >= 100
                      ? '💰 Meta mensal batida! Parabéns!'
                      : `Faltam ${formatarMoeda(metaMensal - vendasMes)} este mês`}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">
                  Defina uma meta diária para acompanhar seu progresso
                </p>
                <Button
                  onClick={() => setEditandoMeta(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Definir Meta
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alertas de estoque */}
        {alertasEstoque.length > 0 && (
          <Card className="shadow-lg border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Atenção no estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {alertasEstoque.slice(0, 3).map((produto) => (
                  <div
                    key={produto.id}
                    className="flex justify-between items-center p-2 bg-orange-50 rounded"
                  >
                    <span className="text-sm font-medium">{produto.nome}</span>
                    <Badge variant="destructive" className="bg-orange-600">
                      {produto.estoque} restantes
                    </Badge>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => onNavigate('estoque')}
                variant="outline"
                className="w-full mt-3"
                size="sm"
              >
                Ver estoque completo
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Conquistas recentes */}
        {conquistasDesbloqueadas.length > 0 && (
          <Card className="shadow-lg border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                🏆 Suas conquistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {conquistasDesbloqueadas.slice(0, 4).map((conquista) => (
                  <div
                    key={conquista.id}
                    className="p-3 bg-purple-50 rounded-lg text-center border border-purple-200"
                  >
                    <div className="text-2xl mb-1">{conquista.icone}</div>
                    <p className="text-xs font-semibold text-purple-700">
                      {conquista.titulo}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Atalhos principais */}
        <div className="grid grid-cols-2 gap-3 pb-6">
          <Button
            onClick={() => onNavigate('venda')}
            className="h-24 bg-emerald-600 hover:bg-emerald-700 flex flex-col gap-2"
            size="lg"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="text-sm">Lançar Venda</span>
          </Button>

          <Button
            onClick={() => onNavigate('gasto')}
            className="h-24 bg-red-600 hover:bg-red-700 flex flex-col gap-2"
            size="lg"
          >
            <Receipt className="w-6 h-6" />
            <span className="text-sm">Lançar Gasto</span>
          </Button>

          <Button
            onClick={() => onNavigate('estoque')}
            variant="outline"
            className="h-24 flex flex-col gap-2 border-2"
            size="lg"
          >
            <Package className="w-6 h-6" />
            <span className="text-sm">Ver Estoque</span>
          </Button>

          <Button
            onClick={() => onNavigate('calculadora')}
            variant="outline"
            className="h-24 flex flex-col gap-2 border-2"
            size="lg"
          >
            <Calculator className="w-6 h-6" />
            <span className="text-sm">Calcular Preço</span>
          </Button>

          <Button
            onClick={() => onNavigate('clientes')}
            variant="outline"
            className="h-24 flex flex-col gap-2 border-2"
            size="lg"
          >
            <Users className="w-6 h-6" />
            <span className="text-sm">Clientes</span>
          </Button>

          <Button
            onClick={() => onNavigate('bot')}
            variant="outline"
            className="h-24 flex flex-col gap-2 border-2 border-purple-300 text-purple-700 hover:bg-purple-50"
            size="lg"
          >
            <Bot className="w-6 h-6" />
            <span className="text-sm">Bot do Lucro</span>
          </Button>
        </div>
      </div>

      {/* Botão flutuante do Bot */}
      <button
        onClick={() => onNavigate('bot')}
        className="fixed bottom-6 right-6 w-16 h-16 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110"
      >
        <Bot className="w-8 h-8" />
      </button>
    </div>
  );
}
