// Utilitários e funções auxiliares

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

export function formatarData(data: string): string {
  const date = new Date(data);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

export function formatarDataHora(data: string): string {
  const date = new Date(data);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function calcularLucro(vendas: number, gastos: number): number {
  return vendas - gastos;
}

export function calcularMargemLucro(precoVenda: number, custo: number): number {
  if (precoVenda === 0) return 0;
  return ((precoVenda - custo) / precoVenda) * 100;
}

export function calcularPrecoSugerido(custo: number, margemDesejada: number): number {
  return custo / (1 - margemDesejada / 100);
}

export function gerarId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function obterDataHoje(): string {
  return new Date().toISOString().split('T')[0];
}

export function obterSemanaAtual(): string {
  const hoje = new Date();
  const primeiroDia = new Date(hoje.setDate(hoje.getDate() - hoje.getDay()));
  return primeiroDia.toISOString().split('T')[0];
}

export function calcularProgressoMeta(atual: number, meta: number): number {
  if (meta === 0) return 0;
  return Math.min((atual / meta) * 100, 100);
}
