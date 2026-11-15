// frontend/src/components/Login.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // useEffect: Se o usuário já estiver autenticado, redireciona para a home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCarregando(true);

    try {
      await login(email, senha);
      toast.success('Login bem-sucedido!', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Falha ao autenticar. Verifique seus dados.', {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="login-card w-full max-w-md bg-white rounded-xl shadow-2xl p-8 border border-slate-100">
        <div className="login-header text-center mb-6">
          <div className="login-logo-icon inline-flex items-center justify-center w-14 h-14 bg-blue-50 text-blue-600 rounded-full mb-3">
            <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Sistema DM-CMMS</h1>
          <p className="text-sm text-slate-500 mt-1">Bem-vindo ao sistema de gestão de manutenção</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label 
              htmlFor="email"
              style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}
            >
              E-mail
            </label>
            <input 
              type="email" 
              id="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{
                display: 'block',
                width: '100%',
                height: '44px',
                padding: '0.625rem 0.875rem',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.95rem',
                color: '#0f172a',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box',
                outline: 'none',
              }}
              placeholder="seu@email.com"
              disabled={carregando}
            />
          </div>

          <div>
            <label 
              htmlFor="senha"
              style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}
            >
              Senha
            </label>
            <input 
              type="password" 
              id="senha"
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              required 
              style={{
                display: 'block',
                width: '100%',
                height: '44px',
                padding: '0.625rem 0.875rem',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.95rem',
                color: '#0f172a',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box',
                outline: 'none',
              }}
              placeholder="••••••••"
              disabled={carregando}
            />
          </div>

          <div style={{ marginTop: '10px' }}>
            <button 
              type="submit" 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '44px',
                padding: '0 1rem',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.95rem',
                borderRadius: '8px',
                border: 'none',
                cursor: carregando ? 'not-allowed' : 'pointer',
                boxSizing: 'border-box',
                transition: 'background-color 0.2s',
              }}
              disabled={carregando}
            >
              {carregando ? 'Entrando...' : 'Entrar no Sistema'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;