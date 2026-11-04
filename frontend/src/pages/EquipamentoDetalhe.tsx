import React from 'react';
import type { Equipamento } from '../types/equipamento';

interface EquipamentoDetalheProps {
  equipments: Equipamento[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const EquipamentoDetalhe: React.FC<EquipamentoDetalheProps> = () => {
  return (
    <div>
      <h1>Detalhes do Equipamento</h1>
      <p>Vista detalhada de um equipamento específico</p>
    </div>
  );
};

export default EquipamentoDetalhe;