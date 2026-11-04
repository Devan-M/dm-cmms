import React from 'react';
import type { Equipamento } from '../types/equipamento';

interface EquipamentosProps {
  equipments: Equipamento[];
  onAdd: (equipamento: Equipamento) => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const Equipamentos: React.FC<EquipamentosProps> = () => {
  return (
    <div>
      <h1>Equipamentos</h1>
      <p>Lista de equipamentos em uso</p>
    </div>
  );
};

export default Equipamentos;