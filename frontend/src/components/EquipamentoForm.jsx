import React, { useState } from 'react';
import './EquipamentoForm.css';
import { PlusCircle } from 'lucide-react';

/**
 * Componente EquipamentoForm
 * Utiliza useState para gerenciar o formulário
 * Comunica com o componente pai através da prop callback onAddEquipamento
 */
function EquipamentoForm({ onAddEquipamento }) {
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [setor, setSetor] = useState('Usinagem');
  const [criticidade, setCriticidade] = useState('Média');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nome.trim() || !codigo.trim()) {
      alert('Por favor, preencha o nome e o código do equipamento!');
      return;
    }

    const novoEquipamento = {
      id: Date.now(),
      nome,
      codigo: codigo.toUpperCase(),
      setor,
      criticidade,
      status: 'Operacional',
      dataCadastro: new Date().toLocaleDateString('pt-BR')
    };

    // Propriedade recebida via props disparada para o componente pai
    onAddEquipamento(novoEquipamento);

    // Limpa os estados do formulário
    setNome('');
    setCodigo('');
    setSetor('Usinagem');
    setCriticidade('Média');
  };

  return (
    <form className="equipamento-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="nome">Nome do Ativo / Equipamento</label>
        <input
          id="nome"
          type="text"
          placeholder="Ex: Torno CNC Mazak"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="codigo">Código / Tag</label>
        <input
          id="codigo"
          type="text"
          placeholder="Ex: TNC-001"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="setor">Setor</label>
          <select
            id="setor"
            value={setor}
            onChange={(e) => setSetor(e.target.value)}
          >
            <option value="Usinagem">Usinagem</option>
            <option value="Soldagem">Soldagem</option>
            <option value="Pintura">Pintura</option>
            <option value="Montagem">Montagem</option>
            <option value="Utilidades">Utilidades</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="criticidade">Criticidade</label>
          <select
            id="criticidade"
            value={criticidade}
            onChange={(e) => setCriticidade(e.target.value)}
          >
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
            <option value="Crítica">Crítica</option>
          </select>
        </div>
      </div>

      <button type="submit" className="btn-submit">
        <PlusCircle size={18} />
        Cadastrar Equipamento
      </button>
    </form>
  );
}

export default EquipamentoForm;
