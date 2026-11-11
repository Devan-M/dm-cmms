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
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h1>Sistema DM-CMMS</h1>
          <p>Bem-vindo ao sistema de gestão de manutenção</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="login-label" htmlFor="email">E-mail</label>
            <input 
              type="email" 
              id="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="login-input"
              placeholder="seu@email.com"
              disabled={carregando}
            />
          </div>

          <div>
            <label className="login-label" htmlFor="senha">Senha</label>
            <input 
              type="password" 
              id="senha"
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              required 
              className="login-input"
              placeholder="••••••••"
              disabled={carregando}
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar no Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;