'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Bot, Send, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatarMoeda, obterDataHoje } from '@/lib/utils-app';

interface BotLucroProps {
  onVoltar: () => void;
}

interface Mensagem {
  tipo: 'usuario' | 'bot';
  texto: string;
}

export default function BotLucro({ onVoltar }: BotLucroProps) {
  const { vendas, gastos, produtos, config } = useApp();
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      tipo: 'bot',
      texto: 'Oi! Sou o Bot do Lucro 🤖 Tô aqui pra te ajudar com seu negócio. Pode me perguntar qualquer coisa sobre vendas, gastos, estoque ou preços!',
    },
  ]);
  const [inputUsuario, setInputUsuario] = useState('');

  const hoje = obterDataHoje();

  const processarPergunta = (pergunta: string) => {
    const p = pergunta.toLowerCase();

    // Vendas de hoje
    if (p.includes('vend') && (p.includes('hoje') || p.includes('dia'))) {
      const vendasHoje = vendas
        .filter((v) => v.data.startsWith(hoje))
        .reduce((acc, v) => acc + v.valorTotal, 0);

      return `Hoje você vendeu ${formatarMoeda(vendasHoje)}! ${
        vendasHoje > 0
          ? 'Tá indo bem! 🎉'
          : 'Ainda não registrou vendas hoje. Bora lançar as vendas!'
      }`;
    }

    // Gastos de hoje
    if (p.includes('gast') && (p.includes('hoje') || p.includes('dia'))) {
      const gastosHoje = gastos
        .filter((g) => g.data.startsWith(hoje))
        .reduce((acc, g) => acc + g.valor, 0);

      return `Hoje você gastou ${formatarMoeda(gastosHoje)}. ${
        gastosHoje > 0
          ? 'Fique de olho nos gastos!'
          : 'Ainda não registrou gastos hoje.'
      }`;
    }

    // Lucro
    if (p.includes('lucr')) {
      const vendasHoje = vendas
        .filter((v) => v.data.startsWith(hoje))
        .reduce((acc, v) => acc + v.valorTotal, 0);
      const gastosHoje = gastos
        .filter((g) => g.data.startsWith(hoje))
        .reduce((acc, g) => acc + g.valor, 0);
      const lucro = vendasHoje - gastosHoje;

      return `Seu lucro hoje é de ${formatarMoeda(lucro)}. ${
        lucro > 0
          ? 'Tá no lucro! Continue assim! 💰'
          : lucro < 0
          ? 'Atenção! Você gastou mais do que vendeu. Vamos aumentar as vendas? 📈'
          : 'Ainda não teve movimentação hoje.'
      }`;
    }

    // Estoque
    if (p.includes('estoqu')) {
      const alertas = produtos.filter((p) => p.estoque <= p.estoqueMinimo);
      if (alertas.length > 0) {
        return `Atenção! Você tem ${alertas.length} produto(s) com estoque baixo: ${alertas
          .map((p) => `${p.nome} (${p.estoque} unidades)`)
          .join(', ')}. Planeja repor antes de faltar!`;
      }
      return `Seu estoque tá ok! Você tem ${produtos.length} produto(s) cadastrado(s). 📦`;
    }

    // Produto mais vendido
    if (p.includes('mais vend') || p.includes('melhor')) {
      const vendasPorProduto = vendas.reduce((acc, v) => {
        acc[v.produtoNome] = (acc[v.produtoNome] || 0) + v.quantidade;
        return acc;
      }, {} as Record<string, number>);

      const maisVendido = Object.entries(vendasPorProduto).sort((a, b) => b[1] - a[1])[0];

      if (maisVendido) {
        return `Seu produto mais vendido é ${maisVendido[0]} com ${maisVendido[1]} vendas! É o queridinho dos clientes! 🌟`;
      }
      return 'Você ainda não tem vendas registradas. Comece a lançar suas vendas!';
    }

    // Análise de custo fixo - CORRIGIDO
    if (p.includes('custo fixo') || p.includes('pagar custo') || (p.includes('quantas') && p.includes('vend'))) {
      if (config.gastosFixosMensais > 0 && produtos.length > 0) {
        // Calcular lucro médio por venda
        const lucroTotalVendas = vendas.reduce((acc, v) => {
          const produto = produtos.find(prod => prod.id === v.produtoId);
          if (produto) {
            const lucroPorUnidade = produto.precoVenda - produto.custoUnitario;
            return acc + (lucroPorUnidade * v.quantidade);
          }
          return acc;
        }, 0);
        
        const lucroMedioPorVenda = vendas.length > 0 ? lucroTotalVendas / vendas.length : 0;
        
        if (lucroMedioPorVenda > 0) {
          const vendasNecessarias = Math.ceil(config.gastosFixosMensais / lucroMedioPorVenda);
          return `Com seu lucro médio de ${formatarMoeda(lucroMedioPorVenda)} por venda, você precisa vender ${vendasNecessarias} vezes no mês para pagar seu custo fixo de ${formatarMoeda(config.gastosFixosMensais)}. Depois disso, é lucro puro! 💰`;
        } else {
          // Se não tem vendas ainda, usar o primeiro produto como exemplo
          const primeiroProduto = produtos[0];
          const lucroPorUnidade = primeiroProduto.precoVenda - primeiroProduto.custoUnitario;
          if (lucroPorUnidade > 0) {
            const vendasNecessarias = Math.ceil(config.gastosFixosMensais / lucroPorUnidade);
            return `Com base no seu produto "${primeiroProduto.nome}" que tem ${formatarMoeda(lucroPorUnidade)} de lucro por unidade, você precisa vender ${vendasNecessarias} unidades no mês para pagar seu custo fixo de ${formatarMoeda(config.gastosFixosMensais)}. 📊`;
          }
        }
      }
      return 'Configure seus custos fixos e produtos para eu calcular quantas vendas você precisa fazer!';
    }

    // Dicas gerais
    if (p.includes('dica') || p.includes('ajuda') || p.includes('conselho')) {
      const dicas = [
        'Registre TODAS as vendas e gastos, mesmo os pequenos. Assim você tem controle real do negócio!',
        'Mantenha sempre um estoque mínimo. Nunca deixe faltar produto pro cliente!',
        'Calcule seu preço com margem de lucro de pelo menos 30-40%. Você precisa lucrar!',
        'Separe o dinheiro do negócio do seu dinheiro pessoal. Isso é fundamental!',
        'Acompanhe suas vendas todo dia. Quanto mais você controla, mais você cresce!',
      ];
      return dicas[Math.floor(Math.random() * dicas.length)];
    }

    // Meta - CORRIGIDO
    if (p.includes('meta')) {
      const vendasHoje = vendas
        .filter((v) => v.data.startsWith(hoje))
        .reduce((acc, v) => acc + v.valorTotal, 0);

      if (config.metaDiaria) {
        const falta = config.metaDiaria - vendasHoje;
        if (falta <= 0) {
          return `Você já bateu sua meta de hoje! 🎉 Tá voando! Continue assim!`;
        }
        
        // Calcular quantas vendas faltam baseado no lucro médio por venda
        if (vendas.length > 0 && produtos.length > 0) {
          // Calcular lucro médio por venda
          const lucroTotalVendas = vendas.reduce((acc, v) => {
            const produto = produtos.find(p => p.id === v.produtoId);
            if (produto) {
              const lucroPorUnidade = produto.precoVenda - produto.custoUnitario;
              return acc + (lucroPorUnidade * v.quantidade);
            }
            return acc;
          }, 0);
          
          const lucroMedioPorVenda = lucroTotalVendas / vendas.length;
          
          if (lucroMedioPorVenda > 0) {
            const vendasNecessarias = Math.ceil(falta / lucroMedioPorVenda);
            return `Faltam ${formatarMoeda(falta)} pra bater sua meta de hoje. Com base no seu lucro médio de ${formatarMoeda(lucroMedioPorVenda)} por venda, você precisa vender mais ${vendasNecessarias} vezes. Você consegue! 💪`;
          }
        }
        
        return `Faltam ${formatarMoeda(falta)} pra bater sua meta de hoje. Você consegue! 💪`;
      }
      return 'Você ainda não definiu uma meta diária. Que tal definir uma agora?';
    }

    // Resposta padrão
    return `Desculpa, não entendi bem sua pergunta. Você pode me perguntar sobre:
    
• "Quanto vendi hoje?"
• "Quanto gastei hoje?"
• "Qual meu lucro?"
• "Como tá o estoque?"
• "Qual produto mais vende?"
• "Quantas vendas preciso fazer?"
• "Me dá uma dica"
• "Como tá minha meta?"

Tô aqui pra te ajudar! 😊`;
  };

  const enviarMensagem = () => {
    if (!inputUsuario.trim()) return;

    // Adicionar mensagem do usuário
    const novaMensagemUsuario: Mensagem = {
      tipo: 'usuario',
      texto: inputUsuario,
    };

    // Processar resposta do bot
    const resposta = processarPergunta(inputUsuario);
    const novaMensagemBot: Mensagem = {
      tipo: 'bot',
      texto: resposta,
    };

    setMensagens((prev) => [...prev, novaMensagemUsuario, novaMensagemBot]);
    setInputUsuario('');
  };

  const sugestoes = [
    'Quanto vendi hoje?',
    'Qual meu lucro?',
    'Como tá o estoque?',
    'Me dá uma dica',
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bot className="w-7 h-7" />
              Bot do Lucro
            </h1>
            <p className="text-purple-100 text-sm">Seu assistente inteligente</p>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 space-y-4 overflow-y-auto pb-32">
        {mensagens.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                msg.tipo === 'usuario'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white shadow-md text-gray-800'
              }`}
            >
              {msg.tipo === 'bot' && (
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-semibold text-purple-600">Bot do Lucro</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-line">{msg.texto}</p>
            </div>
          </div>
        ))}

        {/* Sugestões */}
        {mensagens.length === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 text-center">Perguntas rápidas:</p>
            <div className="grid grid-cols-2 gap-2">
              {sugestoes.map((sugestao, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    setInputUsuario(sugestao);
                    setTimeout(() => enviarMensagem(), 100);
                  }}
                  variant="outline"
                  className="text-xs h-auto py-3 whitespace-normal"
                >
                  <Sparkles className="w-3 h-3 mr-2 flex-shrink-0" />
                  {sugestao}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input fixo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <Input
            value={inputUsuario}
            onChange={(e) => setInputUsuario(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
            placeholder="Digite sua pergunta..."
            className="flex-1"
          />
          <Button
            onClick={enviarMensagem}
            disabled={!inputUsuario.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
