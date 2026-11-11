import React from 'react';

interface LayoutProps {
  equipamentos?: Array<{
    id: number;
    nome: string;
    codigo: string;
    setor: string;
    criticidade: string;
    status: string;
  }>;
  ordens?: Array<{
    id: number;
    equipamento: string;
    tipo: string;
    prioridade: string;
    status: string;
    responsavel: string;
  }>;
}

const Layout: React.FC<LayoutProps> = ({ equipamentos, ordens }) => {
  const sidebarItems = [
    { id: 'dash', nome: 'Dashboard', caminho: '/' },
    { id: 'equip', nome: 'Equipamentos', caminho: '/equipamentos' },
    { id: 'ordens', nome: 'Ordens de Manutenção', caminho: '/ordens' },
  ];

  return (
    <div className="shell" style={{ display: 'flex', height: '100vh' }}>
      <aside className="sidebar" style={{ width: '250px', background: 'var(--bg-primary)', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
        <div className="sidebar-header" style={{ textAlign: 'center', paddingBottom: '1rem', borderBottom: '1px solid #ddd' }}>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>DM-CMMS</h2>
        </div>
        <nav className="sidebar-nav" style={{ marginTop: '1rem' }}>
          {sidebarItems.map((item) => (
            <a key={item.id} href={item.caminho} style={{
              display: 'block', padding: '0.75rem 1rem', margin: '0 0.25rem', borderRadius: '0.5rem',
              textDecoration: 'none', color: 'var(--text-primary)', fontWeight: item.id === 'ordens' ? 'bold' : 'normal'
            }}>
              {item.nome}
            </a>
          ))}
        </nav>
      </aside>
      
      <div className="main-shell" style={{ flex: 1, padding: '2rem', background: 'var(--bg-primary)' }}>
        <main>
          <h1>Bem-vindo ao DM-CMMS</h1>
          <p>Sistema de gestão de manutenção para empresas</p>
          {equipamentos && (
            <div style={{ marginTop: '2rem', padding: '1rem' }}>
              <h3>Equipamentos Disponíveis ({equipamentos.length})</h3>
              {equipamentos.slice(0, 5).map((eq) => (
                <p key={eq.id}>{eq.nome}</p>
              ))}
            </div>
          )}
          {ordens && (
            <div style={{ marginTop: '1rem' }}>
              <h3>Ordens Recentes</h3>
              {ordens.slice(0, 5).map((os) => (
                <p key={os.id}>{os.equipamento} - {os.tipo}</p>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;