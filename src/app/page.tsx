'use client';

import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AppProvider, useApp } from '@/contexts/AppContext';
import Login from '@/components/Login';
import Onboarding from '@/components/Onboarding';
import Dashboard from '@/components/Dashboard';
import LancarVenda from '@/components/LancarVenda';
import LancarGasto from '@/components/LancarGasto';
import Estoque from '@/components/Estoque';
import Calculadora from '@/components/Calculadora';
import BotLucro from '@/components/BotLucro';
import PainelAdmin from '@/components/PainelAdmin';

type Tela =
  | 'dashboard'
  | 'venda'
  | 'gasto'
  | 'estoque'
  | 'calculadora'
  | 'clientes'
  | 'bot'
  | 'admin';

function AppContent() {
  const { estaAutenticado } = useAuth();
  const { config } = useApp();
  const [telaAtual, setTelaAtual] = useState<Tela>('dashboard');
  const [mostrarOnboarding, setMostrarOnboarding] = useState(false);

  // Sincronizar onboarding com config carregado
  useEffect(() => {
    if (estaAutenticado) {
      setMostrarOnboarding(!config.onboardingCompleto);
    }
  }, [estaAutenticado, config.onboardingCompleto]);

  // Se não está autenticado, mostrar tela de login
  if (!estaAutenticado) {
    return <Login />;
  }

  // Se está autenticado mas não completou onboarding
  if (mostrarOnboarding) {
    return <Onboarding onComplete={() => setMostrarOnboarding(false)} />;
  }

  // Renderizar tela atual
  const renderizarTela = () => {
    switch (telaAtual) {
      case 'venda':
        return <LancarVenda onVoltar={() => setTelaAtual('dashboard')} />;
      case 'gasto':
        return <LancarGasto onVoltar={() => setTelaAtual('dashboard')} />;
      case 'estoque':
        return <Estoque onVoltar={() => setTelaAtual('dashboard')} />;
      case 'calculadora':
        return <Calculadora onVoltar={() => setTelaAtual('dashboard')} />;
      case 'bot':
        return <BotLucro onVoltar={() => setTelaAtual('dashboard')} />;
      case 'admin':
        return <PainelAdmin onVoltar={() => setTelaAtual('dashboard')} />;
      default:
        return <Dashboard onNavigate={(tela) => setTelaAtual(tela as Tela)} />;
    }
  };

  return renderizarTela();
}

export default function Home() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
