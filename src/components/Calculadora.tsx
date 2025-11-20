'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calculator, TrendingUp } from 'lucide-react';
import { formatarMoeda, calcularMargemLucro } from '@/lib/utils-app';

interface CalculadoraProps {
  onVoltar: () => void;
}

export default function Calculadora({ onVoltar }: CalculadoraProps) {
  const [custo, setCusto] = useState('');
  const [margemDesejada, setMargemDesejada] = useState('40');

  const custoNum = parseFloat(custo) || 0;
  const margemNum = parseFloat(margemDesejada) || 0;

  const precoSugerido = custoNum > 0 ? custoNum / (1 - margemNum / 100) : 0;
  const lucroUnitario = precoSugerido - custoNum;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
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
            <h1 className="text-2xl font-bold">Calcular Preço</h1>
            <p className="text-purple-100 text-sm">Descubra quanto cobrar</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-purple-600" />
              Calculadora de preços
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="custo">Quanto custa fazer? (R$)</Label>
              <Input
                id="custo"
                type="number"
                step="0.01"
                placeholder="Ex: 8.50"
                value={custo}
                onChange={(e) => setCusto(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-gray-600">
                Some todos os custos: ingredientes, embalagem, mão de obra...
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="margem">Margem de lucro desejada (%)</Label>
              <Input
                id="margem"
                type="number"
                step="1"
                placeholder="40"
                value={margemDesejada}
                onChange={(e) => setMargemDesejada(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-gray-600">
                Recomendado: entre 30% e 50% para a maioria dos negócios
              </p>
            </div>

            {custoNum > 0 && margemNum > 0 && (
              <>
                <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200 space-y-4">
                  <div>
                    <p className="text-sm text-gray-700 mb-2">💰 Preço sugerido de venda:</p>
                    <p className="text-4xl font-bold text-purple-700">
                      {formatarMoeda(precoSugerido)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-purple-200">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Seu lucro por venda</p>
                      <p className="text-xl font-bold text-emerald-600">
                        {formatarMoeda(lucroUnitario)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Margem de lucro</p>
                      <p className="text-xl font-bold text-blue-600">{margemNum.toFixed(0)}%</p>
                    </div>
                  </div>
                </div>

                <Card className="border-emerald-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      Simulação de vendas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[10, 20, 50, 100].map((qtd) => (
                        <div
                          key={qtd}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded"
                        >
                          <span className="text-sm text-gray-700">
                            Vendendo {qtd} unidades:
                          </span>
                          <div className="text-right">
                            <p className="font-semibold text-emerald-600">
                              {formatarMoeda(lucroUnitario * qtd)}
                            </p>
                            <p className="text-xs text-gray-500">de lucro</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </CardContent>
        </Card>

        {/* Dicas */}
        <Card className="shadow-lg border-blue-200">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <p className="font-semibold text-blue-700">💡 Dicas importantes:</p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>
                  <strong>Margem baixa (20-30%):</strong> produtos de alta rotação, muita
                  concorrência
                </li>
                <li>
                  <strong>Margem média (30-50%):</strong> ideal para maioria dos negócios
                </li>
                <li>
                  <strong>Margem alta (50-70%):</strong> produtos exclusivos, artesanais,
                  personalizados
                </li>
                <li>
                  Pesquise os preços da concorrência antes de definir o seu!
                </li>
                <li>
                  Lembre de incluir TODOS os custos: ingredientes, embalagem, gás, tempo...
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
