'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Smartphone, Lock, User, TrendingUp, Store } from 'lucide-react';

export default function Login() {
  const { login, cadastrar } = useAuth();
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  const [nome, setNome] = useState('');
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [celular, setCelular] = useState('');
  const [senha, setSenha] = useState('');

  const formatarCelular = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return numeros.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };

  const handleCelularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarCelular(e.target.value);
    setCelular(valorFormatado);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (modo === 'cadastro') {
      const sucesso = cadastrar(nome, nomeEmpresa, celular, senha);
      if (sucesso) {
        // Login automático após cadastro
      }
    } else {
      login(celular, senha);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Header */}
        <div className="text-center text-white space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <TrendingUp className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">Meu Lucro</h1>
          <p className="text-emerald-100">
            Controle seu negócio de forma simples
          </p>
        </div>

        {/* Card de Login/Cadastro */}
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {modo === 'login' ? 'Entrar' : 'Criar Conta'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {modo === 'cadastro' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nome">Seu nome</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="nome"
                        type="text"
                        placeholder="Digite seu nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nomeEmpresa">Nome da sua empresa</Label>
                    <div className="relative">
                      <Store className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="nomeEmpresa"
                        type="text"
                        placeholder="Ex: Marmitas da Maria"
                        value={nomeEmpresa}
                        onChange={(e) => setNomeEmpresa(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="celular">Celular com WhatsApp</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="celular"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={celular}
                    onChange={handleCelularChange}
                    className="pl-10"
                    maxLength={15}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="pl-10"
                    minLength={4}
                    required
                  />
                </div>
                {modo === 'cadastro' && (
                  <p className="text-xs text-gray-500">
                    Mínimo de 4 caracteres
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg"
              >
                {modo === 'login' ? 'Entrar' : 'Criar Conta'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setModo(modo === 'login' ? 'cadastro' : 'login');
                  setNome('');
                  setNomeEmpresa('');
                  setCelular('');
                  setSenha('');
                }}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {modo === 'login'
                  ? 'Não tem conta? Cadastre-se'
                  : 'Já tem conta? Faça login'}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-white/80 text-sm">
          Simples, prático e feito pra você
        </p>
      </div>
    </div>
  );
}
