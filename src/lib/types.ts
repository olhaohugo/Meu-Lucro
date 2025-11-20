// Tipos do app Meu Lucro

export interface Produto {
  id: string;
  nome: string;
  custoUnitario: number;
  precoVenda: number;
  estoque: number;
  estoqueMinimo: number;
  categoria?: string;
}

export interface Venda {
  id: string;
  produtoId: string;
  produtoNome: string;
  quantidade: number;
  valorTotal: number;
  data: string;
  clienteId?: string;
}

export interface Gasto {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'fixo' | 'variavel';
  data: string;
  categoria?: string;
}

export interface Cliente {
  id: string;
  nome: string;
  telefone?: string;
  produtoFavorito?: string;
  ultimaCompra?: string;
  totalCompras: number;
}

export interface Meta {
  id: string;
  tipo: 'diaria' | 'semanal' | 'mensal';
  valor: number;
  periodo: string;
}

export interface ConfiguracaoNegocio {
  nomeNegocio: string;
  tipoNegocio: string;
  gastosFixosMensais: number;
  metaDiaria?: number;
  metaSemanal?: number;
  onboardingCompleto: boolean;
}

export interface Conquista {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  desbloqueada: boolean;
  dataDesbloqueio?: string;
}

export interface DadosDashboard {
  vendasHoje: number;
  gastosHoje: number;
  lucroHoje: number;
  metaSemanal: number;
  progressoMeta: number;
  alertasEstoque: Produto[];
  conquistasRecentes: Conquista[];
}
