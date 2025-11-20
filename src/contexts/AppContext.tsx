'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Produto,
  Venda,
  Gasto,
  Cliente,
  Meta,
  ConfiguracaoNegocio,
  Conquista,
} from '@/lib/types';
import { gerarId, obterDataHoje, obterSemanaAtual } from '@/lib/utils-app';

interface AppContextType {
  // Configuração
  config: ConfiguracaoNegocio;
  atualizarConfig: (config: Partial<ConfiguracaoNegocio>) => void;
  
  // Produtos
  produtos: Produto[];
  adicionarProduto: (produto: Omit<Produto, 'id'>) => void;
  atualizarProduto: (id: string, produto: Partial<Produto>) => void;
  removerProduto: (id: string) => void;
  
  // Vendas
  vendas: Venda[];
  adicionarVenda: (venda: Omit<Venda, 'id' | 'data'>) => void;
  
  // Gastos
  gastos: Gasto[];
  adicionarGasto: (gasto: Omit<Gasto, 'id' | 'data'>) => void;
  
  // Clientes
  clientes: Cliente[];
  adicionarCliente: (cliente: Omit<Cliente, 'id' | 'totalCompras'>) => void;
  
  // Metas
  metas: Meta[];
  definirMeta: (meta: Omit<Meta, 'id'>) => void;
  
  // Conquistas
  conquistas: Conquista[];
  verificarConquistas: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const conquistasIniciais: Conquista[] = [
  {
    id: '1',
    titulo: 'Empreendedor Ativo',
    descricao: 'Registrou vendas todo dia',
    icone: '🔥',
    desbloqueada: false,
  },
  {
    id: '2',
    titulo: 'Empreendedor Organizado',
    descricao: '7 dias com estoque atualizado',
    icone: '📦',
    desbloqueada: false,
  },
  {
    id: '3',
    titulo: 'Gerente Raiz',
    descricao: '30 dias no lucro',
    icone: '💰',
    desbloqueada: false,
  },
  {
    id: '4',
    titulo: 'Bateu Meta, Tá Voando',
    descricao: 'Acertou meta da semana',
    icone: '🚀',
    desbloqueada: false,
  },
];

const configInicial: ConfiguracaoNegocio = {
  nomeNegocio: '',
  tipoNegocio: '',
  gastosFixosMensais: 0,
  onboardingCompleto: false,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ConfiguracaoNegocio>(configInicial);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [metas, setMetas] = useState<Meta[]>([]);
  const [conquistas, setConquistas] = useState<Conquista[]>(conquistasIniciais);
  const [carregado, setCarregado] = useState(false);

  // Carregar dados do usuário logado
  useEffect(() => {
    const carregarDados = () => {
      const sessaoStr = localStorage.getItem('meu-lucro-sessao');
      
      if (sessaoStr) {
        try {
          const sessao = JSON.parse(sessaoStr);
          const usuarioId = sessao.id;
          const storageKey = `meu-lucro-data-${usuarioId}`;
          
          const dadosSalvos = localStorage.getItem(storageKey);
          
          if (dadosSalvos) {
            const dados = JSON.parse(dadosSalvos);
            setConfig(dados.config || configInicial);
            setProdutos(dados.produtos || []);
            setVendas(dados.vendas || []);
            setGastos(dados.gastos || []);
            setClientes(dados.clientes || []);
            setMetas(dados.metas || []);
            setConquistas(dados.conquistas || conquistasIniciais);
          } else {
            // Primeiro acesso do usuário - dados vazios
            setConfig(configInicial);
            setProdutos([]);
            setVendas([]);
            setGastos([]);
            setClientes([]);
            setMetas([]);
            setConquistas(conquistasIniciais);
          }
        } catch (error) {
          console.error('Erro ao carregar dados:', error);
        }
      } else {
        // Sem sessão - resetar tudo
        setConfig(configInicial);
        setProdutos([]);
        setVendas([]);
        setGastos([]);
        setClientes([]);
        setMetas([]);
        setConquistas(conquistasIniciais);
      }
      
      setCarregado(true);
    };

    carregarDados();
  }, []);

  // Salvar dados automaticamente quando houver mudanças
  useEffect(() => {
    if (!carregado) return;

    const sessaoStr = localStorage.getItem('meu-lucro-sessao');
    if (!sessaoStr) return;

    try {
      const sessao = JSON.parse(sessaoStr);
      const usuarioId = sessao.id;
      const storageKey = `meu-lucro-data-${usuarioId}`;

      const dados = {
        config,
        produtos,
        vendas,
        gastos,
        clientes,
        metas,
        conquistas,
      };

      localStorage.setItem(storageKey, JSON.stringify(dados));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  }, [config, produtos, vendas, gastos, clientes, metas, conquistas, carregado]);

  const atualizarConfig = (novoConfig: Partial<ConfiguracaoNegocio>) => {
    setConfig((prev) => ({ ...prev, ...novoConfig }));
  };

  const adicionarProduto = (produto: Omit<Produto, 'id'>) => {
    const novoProduto: Produto = {
      ...produto,
      id: gerarId(),
    };
    setProdutos((prev) => [...prev, novoProduto]);
  };

  const atualizarProduto = (id: string, produto: Partial<Produto>) => {
    setProdutos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...produto } : p))
    );
  };

  const removerProduto = (id: string) => {
    setProdutos((prev) => prev.filter((p) => p.id !== id));
  };

  const adicionarVenda = (venda: Omit<Venda, 'id' | 'data'>) => {
    const novaVenda: Venda = {
      ...venda,
      id: gerarId(),
      data: new Date().toISOString(),
    };
    setVendas((prev) => [...prev, novaVenda]);

    // Atualizar estoque
    const produto = produtos.find((p) => p.id === venda.produtoId);
    if (produto) {
      atualizarProduto(produto.id, {
        estoque: produto.estoque - venda.quantidade,
      });
    }

    // Atualizar cliente
    if (venda.clienteId) {
      setClientes((prev) =>
        prev.map((c) =>
          c.id === venda.clienteId
            ? {
                ...c,
                ultimaCompra: new Date().toISOString(),
                totalCompras: c.totalCompras + venda.valorTotal,
              }
            : c
        )
      );
    }

    verificarConquistas();
  };

  const adicionarGasto = (gasto: Omit<Gasto, 'id' | 'data'>) => {
    const novoGasto: Gasto = {
      ...gasto,
      id: gerarId(),
      data: new Date().toISOString(),
    };
    setGastos((prev) => [...prev, novoGasto]);
  };

  const adicionarCliente = (cliente: Omit<Cliente, 'id' | 'totalCompras'>) => {
    const novoCliente: Cliente = {
      ...cliente,
      id: gerarId(),
      totalCompras: 0,
    };
    setClientes((prev) => [...prev, novoCliente]);
  };

  const definirMeta = (meta: Omit<Meta, 'id'>) => {
    const novaMeta: Meta = {
      ...meta,
      id: gerarId(),
    };
    setMetas((prev) => {
      const filtradas = prev.filter((m) => m.tipo !== meta.tipo);
      return [...filtradas, novaMeta];
    });
  };

  const verificarConquistas = () => {
    const hoje = obterDataHoje();
    const semanaAtual = obterSemanaAtual();

    // Verificar "Empreendedor Ativo" - vendas todo dia
    const vendasUltimos7Dias = vendas.filter((v) => {
      const dataVenda = new Date(v.data);
      const diasAtras = Math.floor(
        (new Date().getTime() - dataVenda.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diasAtras < 7;
    });

    const diasComVendas = new Set(
      vendasUltimos7Dias.map((v) => v.data.split('T')[0])
    ).size;

    if (diasComVendas >= 7) {
      desbloquearConquista('1');
    }

    // Verificar "Bateu Meta, Tá Voando"
    const metaSemanal = metas.find((m) => m.tipo === 'semanal');
    if (metaSemanal) {
      const vendasSemana = vendas.filter((v) => v.data >= semanaAtual);
      const totalSemana = vendasSemana.reduce((acc, v) => acc + v.valorTotal, 0);
      if (totalSemana >= metaSemanal.valor) {
        desbloquearConquista('4');
      }
    }
  };

  const desbloquearConquista = (id: string) => {
    setConquistas((prev) =>
      prev.map((c) =>
        c.id === id && !c.desbloqueada
          ? { ...c, desbloqueada: true, dataDesbloqueio: new Date().toISOString() }
          : c
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        config,
        atualizarConfig,
        produtos,
        adicionarProduto,
        atualizarProduto,
        removerProduto,
        vendas,
        adicionarVenda,
        gastos,
        adicionarGasto,
        clientes,
        adicionarCliente,
        metas,
        definirMeta,
        conquistas,
        verificarConquistas,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
}
