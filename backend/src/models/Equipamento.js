const mongoose = require('mongoose');

const equipamentoSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: [true, 'Código do equipamento é obrigatório'],
      unique: true,
      trim: true,
      uppercase: true
    },
    nome: {
      type: String,
      required: [true, 'Nome do equipamento é obrigatório'],
      trim: true
    },
    setor: {
      type: String,
      required: [true, 'Setor é obrigatório'],
      enum: ['Usinagem', 'Estamparia', 'Utilidades', 'Logística', 'Moldagem', 'Geral'],
      default: 'Geral'
    },
    criticidade: {
      type: String,
      enum: ['Alta', 'Média', 'Baixa'],
      default: 'Média'
    },
    status: {
      type: String,
      enum: ['Operacional', 'Em Manutenção', 'Inativo'],
      default: 'Operacional'
    },
    fabricante: {
      type: String,
      trim: true,
      default: ''
    },
    modelo: {
      type: String,
      trim: true,
      default: ''
    },
    localizacao: {
      type: String,
      trim: true,
      default: ''
    },
    tensao: {
      type: String,
      trim: true,
      default: ''
    },
    dataInstalacao: {
      type: String,
      default: ''
    },
    disponibilidade: {
      type: String,
      default: '100%'
    },
    mtbf: {
      type: String,
      default: '0h'
    },
    custoAcumulado: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      }
    }
  }
);

const Equipamento = mongoose.model('Equipamento', equipamentoSchema);

module.exports = Equipamento;
