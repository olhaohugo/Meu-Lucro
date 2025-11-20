'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, DollarSign, Package, TrendingUp, Users } from 'lucide-react';

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { atualizarConfig, adicionarProduto, definirMeta } = useApp();
  const [etapa, setEtapa] = useState(1);
  
  // Dados do formulário
  const [nomeNegocio, setNomeNegocio] = useState('');
  const [tipoNegocio, setTipoNegocio] = useState('');
  const [nomeProduto, setNomeProduto] = useState('');
  const [custoProduto, setCustoProduto] = useState('');
  const [quantidadeVendida, setQuantidadeVendida] = useState('');
  const [lucroDesejado, setLucroDesejado] = useState('');
  const [gastosFixos, setGastosFixos] = useState('');
  const [metaDiaria, setMetaDiaria] = useState('');

  const proximaEtapa = () => {
    if (etapa === 6) {
      // Calcular preço sugerido
      const custo = parseFloat(custoProduto) || 0;
      const lucro = parseFloat(lucroDesejado) || 0;
      const precoSugerido = custo + lucro;

      // Salvar configurações
      atualizarConfig({
        nomeNegocio,
        tipoNegocio,
        gastosFixosMensais: parseFloat(gastosFixos) || 0,
        metaDiaria: parseFloat(metaDiaria) || 0,
        onboardingCompleto: true,
      });

      // Adicionar primeiro produto
      if (nomeProduto && custo > 0) {
        adicionarProduto({
          nome: nomeProduto,
          custoUnitario: custo,
          precoVenda: precoSugerido,
          estoque: parseInt(quantidadeVendida) || 10,
          estoqueMinimo: 5,
        });
      }

      // Definir meta diária
      if (parseFloat(metaDiaria) > 0) {
        definirMeta({
          tipo: 'diaria',
          valor: parseFloat(metaDiaria),
          periodo: new Date().toISOString().split('T')[0],
        });
      }

      onComplete();
    } else {
      setEtapa(etapa + 1);
    }
  };

  const podeAvancar = () => {
    switch (etapa) {
      case 1:
        return tipoNegocio.length > 0;
      case 2:
        return custoProduto.length > 0;
      case 3:
        return quantidadeVendida.length > 0;
      case 4:
        return lucroDesejado.length > 0;
      case 5:
        return gastosFixos.length > 0;
      case 6:
        return metaDiaria.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-emerald-700">Meu Lucro</CardTitle>
          <CardDescription className="text-base">
            Vamos configurar seu negócio em {6} passos simples
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Indicador de progresso */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div
                key={num}
                className={`h-2 flex-1 rounded-full transition-all ${
                  num <= etapa ? 'bg-emerald-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Etapa 1 */}
          {etapa === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center mb-6">
                <Package className="w-12 h-12 mx-auto mb-3 text-emerald-600" />
                <h3 className="text-xl font-semibold mb-2">O que você vende?</h3>
                <p className="text-sm text-gray-600">
                  Pode ser produto ou serviço. Exemplo: marmita, bolo, manicure...
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Seu produto ou serviço</Label>
                <Input
                  id="tipo"
                  placeholder="Ex: Marmita, Bolo, Manicure..."
                  value={tipoNegocio}
                  onChange={(e) => setTipoNegocio(e.target.value)}
                  className="text-lg"
                />
              </div>
            </div>
          )}

          {/* Etapa 2 */}
          {etapa === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center mb-6">
                <DollarSign className="w-12 h-12 mx-auto mb-3 text-emerald-600" />
                <h3 className="text-xl font-semibold mb-2">Quanto custa fazer?</h3>
                <p className="text-sm text-gray-600">
                  Quanto você gasta pra ter 1 unidade pronta pra vender?
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do produto</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Marmita grande"
                  value={nomeProduto}
                  onChange={(e) => setNomeProduto(e.target.value)}
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custo">Custo por unidade (R$)</Label>
                <Input
                  id="custo"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 8.50"
                  value={custoProduto}
                  onChange={(e) => setCustoProduto(e.target.value)}
                  className="text-lg"
                />
              </div>
            </div>
          )}

          {/* Etapa 3 */}
          {etapa === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center mb-6">
                <Package className="w-12 h-12 mx-auto mb-3 text-emerald-600" />
                <h3 className="text-xl font-semibold mb-2">Quantos você tem?</h3>
                <p className="text-sm text-gray-600">
                  Quantas unidades você consegue vender por dia ou semana?
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade inicial no estoque</Label>
                <Input
                  id="quantidade"
                  type="number"
                  placeholder="Ex: 20"
                  value={quantidadeVendida}
                  onChange={(e) => setQuantidadeVendida(e.target.value)}
                  className="text-lg"
                />
              </div>
            </div>
          )}

          {/* Etapa 4 */}
          {etapa === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center mb-6">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 text-emerald-600" />
                <h3 className="text-xl font-semibold mb-2">Quanto quer lucrar?</h3>
                <p className="text-sm text-gray-600">
                  Quanto você quer ganhar em cada venda?
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lucro">Lucro desejado por unidade (R$)</Label>
                <Input
                  id="lucro"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 6.50"
                  value={lucroDesejado}
                  onChange={(e) => setLucroDesejado(e.target.value)}
                  className="text-lg"
                />
              </div>
              {custoProduto && lucroDesejado && (
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <p className="text-sm text-gray-700 mb-2">💡 Preço sugerido de venda:</p>
                  <p className="text-3xl font-bold text-emerald-700">
                    R$ {(parseFloat(custoProduto) + parseFloat(lucroDesejado)).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Custo: R$ {parseFloat(custoProduto).toFixed(2)} + Lucro: R${' '}
                    {parseFloat(lucroDesejado).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Etapa 5 */}
          {etapa === 5 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center mb-6">
                <DollarSign className="w-12 h-12 mx-auto mb-3 text-emerald-600" />
                <h3 className="text-xl font-semibold mb-2">Seus gastos fixos</h3>
                <p className="text-sm text-gray-600">
                  Quanto você gasta TODO MÊS? (aluguel, luz, internet, taxas...)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gastos">Total de gastos fixos mensais (R$)</Label>
                <Input
                  id="gastos"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 500.00"
                  value={gastosFixos}
                  onChange={(e) => setGastosFixos(e.target.value)}
                  className="text-lg"
                />
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800">
                  💡 Dica: Some aluguel, luz, água, internet, taxas do banco, etc.
                </p>
              </div>
            </div>
          )}

          {/* Etapa 6 */}
          {etapa === 6 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center mb-6">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 text-emerald-600" />
                <h3 className="text-xl font-semibold mb-2">Sua meta diária</h3>
                <p className="text-sm text-gray-600">
                  Quanto você quer faturar por dia?
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta">Meta de vendas por dia (R$)</Label>
                <Input
                  id="meta"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 200.00"
                  value={metaDiaria}
                  onChange={(e) => setMetaDiaria(e.target.value)}
                  className="text-lg"
                />
              </div>
              {gastosFixos && metaDiaria && (
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <p className="text-sm text-gray-700 mb-2">📊 Análise rápida:</p>
                  <p className="text-sm">
                    Pra cobrir seus gastos fixos de R$ {parseFloat(gastosFixos).toFixed(2)}, você
                    precisa vender cerca de{' '}
                    <strong className="text-emerald-700">
                      {Math.ceil(parseFloat(gastosFixos) / 30 / parseFloat(metaDiaria))} dias
                    </strong>{' '}
                    batendo sua meta.
                  </p>
                </div>
              )}
            </div>
          )}

          <Button
            onClick={proximaEtapa}
            disabled={!podeAvancar()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-6"
            size="lg"
          >
            {etapa === 6 ? 'Começar a usar' : 'Próximo'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          {etapa > 1 && (
            <Button
              onClick={() => setEtapa(etapa - 1)}
              variant="ghost"
              className="w-full"
            >
              Voltar
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
