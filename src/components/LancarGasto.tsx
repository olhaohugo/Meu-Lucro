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
import { ArrowLeft, Receipt, Check } from 'lucide-react';
import { formatarMoeda } from '@/lib/utils-app';

interface LancarGastoProps {
  onVoltar: () => void;
}

export default function LancarGasto({ onVoltar }: LancarGastoProps) {
  const { adicionarGasto } = useApp();
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<'fixo' | 'variavel'>('variavel');
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    adicionarGasto({
      descricao,
      valor: parseFloat(valor),
      tipo,
    });

    setSucesso(true);
    setTimeout(() => {
      setSucesso(false);
      setDescricao('');
      setValor('');
      setTipo('variavel');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
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
            <h1 className="text-2xl font-bold">Lançar Gasto</h1>
            <p className="text-red-100 text-sm">Registre suas despesas</p>
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
                    Gasto registrado! ✅
                  </h3>
                  <p className="text-gray-600">Sua despesa foi lançada no sistema</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-red-600" />
                Novo gasto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="descricao">O que você pagou?</Label>
                  <Input
                    id="descricao"
                    placeholder="Ex: Compra de ingredientes, luz, aluguel..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor">Valor gasto (R$)</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 50.00"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de gasto</Label>
                  <Select value={tipo} onValueChange={(v) => setTipo(v as 'fixo' | 'variavel')}>
                    <SelectTrigger id="tipo" className="text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="variavel">
                        <div>
                          <div className="font-semibold">Variável</div>
                          <div className="text-xs text-gray-500">
                            Muda conforme você vende (ingredientes, embalagem...)
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="fixo">
                        <div>
                          <div className="font-semibold">Fixo</div>
                          <div className="text-xs text-gray-500">
                            Todo mês é o mesmo (aluguel, luz, internet...)
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {valor && parseFloat(valor) > 0 && (
                  <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200">
                    <p className="text-sm text-gray-700 mb-2">Valor do gasto:</p>
                    <p className="text-4xl font-bold text-red-700">
                      {formatarMoeda(parseFloat(valor))}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      Tipo: {tipo === 'fixo' ? 'Gasto fixo' : 'Gasto variável'}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!descricao || !valor || parseFloat(valor) <= 0}
                  className="w-full bg-red-600 hover:bg-red-700 text-lg py-6"
                  size="lg"
                >
                  <Receipt className="w-5 h-5 mr-2" />
                  Registrar gasto
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Dicas */}
        <Card className="shadow-lg border-blue-200">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <p className="font-semibold text-blue-700">💡 Dicas:</p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>
                  <strong>Gastos fixos:</strong> aluguel, luz, água, internet, taxas mensais
                </li>
                <li>
                  <strong>Gastos variáveis:</strong> ingredientes, embalagens, combustível,
                  comissões
                </li>
                <li>Registre tudo pra saber se tá tendo lucro de verdade!</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
