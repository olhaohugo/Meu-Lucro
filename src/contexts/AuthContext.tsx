'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Usuario {
  id: string;
  nome: string;
  nomeEmpresa: string;
  celular: string;
  dataCadastro: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  estaAutenticado: boolean;
  login: (celular: string, senha: string) => boolean;
  cadastrar: (nome: string, nomeEmpresa: string, celular: string, senha: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USUARIOS = 'meu-lucro-usuarios';
const STORAGE_KEY_SESSAO = 'meu-lucro-sessao';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Carregar sessão salva ao iniciar
    try {
      const sessaoSalva = localStorage.getItem(STORAGE_KEY_SESSAO);
      if (sessaoSalva) {
        const usuarioSalvo = JSON.parse(sessaoSalva);
        setUsuario(usuarioSalvo);
      }
    } catch (error) {
      console.error('Erro ao carregar sessão:', error);
      localStorage.removeItem(STORAGE_KEY_SESSAO);
    } finally {
      setCarregando(false);
    }
  }, []);

  const cadastrar = (nome: string, nomeEmpresa: string, celular: string, senha: string): boolean => {
    if (!nome || !nomeEmpresa || !celular || !senha) {
      alert('Preencha todos os campos!');
      return false;
    }

    const celularLimpo = celular.replace(/\D/g, '');
    
    if (celularLimpo.length < 10) {
      alert('Celular inválido! Digite com DDD.');
      return false;
    }

    if (senha.length < 4) {
      alert('Senha deve ter no mínimo 4 caracteres!');
      return false;
    }

    const usuariosStr = localStorage.getItem(STORAGE_KEY_USUARIOS);
    const usuarios = usuariosStr ? JSON.parse(usuariosStr) : [];

    const usuarioExiste = usuarios.find((u: any) => u.celular === celularLimpo);
    if (usuarioExiste) {
      alert('Já existe uma conta com esse celular!');
      return false;
    }

    const novoUsuario: Usuario = {
      id: Date.now().toString(),
      nome,
      nomeEmpresa,
      celular: celularLimpo,
      dataCadastro: new Date().toISOString(),
    };

    usuarios.push({ ...novoUsuario, senha });
    localStorage.setItem(STORAGE_KEY_USUARIOS, JSON.stringify(usuarios));

    // Salvar sessão
    setUsuario(novoUsuario);
    localStorage.setItem(STORAGE_KEY_SESSAO, JSON.stringify(novoUsuario));

    return true;
  };

  const login = (celular: string, senha: string): boolean => {
    if (!celular || !senha) {
      alert('Preencha todos os campos!');
      return false;
    }

    const celularLimpo = celular.replace(/\D/g, '');
    const usuariosStr = localStorage.getItem(STORAGE_KEY_USUARIOS);
    const usuarios = usuariosStr ? JSON.parse(usuariosStr) : [];

    const usuarioEncontrado = usuarios.find(
      (u: any) => u.celular === celularLimpo && u.senha === senha
    );

    if (!usuarioEncontrado) {
      alert('Celular ou senha incorretos!');
      return false;
    }

    const { senha: _, ...usuarioSemSenha } = usuarioEncontrado;
    
    // Salvar sessão
    setUsuario(usuarioSemSenha);
    localStorage.setItem(STORAGE_KEY_SESSAO, JSON.stringify(usuarioSemSenha));

    return true;
  };

  const logout = () => {
    // Limpar estado
    setUsuario(null);
    
    // Limpar localStorage
    localStorage.removeItem(STORAGE_KEY_SESSAO);
    
    // Forçar reload da página para garantir que tudo seja limpo
    window.location.reload();
  };

  // Não renderizar nada enquanto carrega
  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        estaAutenticado: !!usuario,
        login,
        cadastrar,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
