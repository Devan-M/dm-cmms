const mongoose = require('mongoose');

const ordemServicoSchema = new mongoose.Schema(
  {
    numero: {
      type: Number,
      required: [true, 'Número da OS é obrigatório'],
      unique: true
    },
    equipamento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipamento',
      required: false
    },
    codigoEquipamento: {
      type: String,
      required: [true, 'Código do equipamento é obrigatório']
    },
    nomeEquipamento: {
      type: String,
      required: [true, 'Nome do equipamento é obrigatório']
    },
    tipo: {
      type: String,
      enum: ['Corretiva', 'Preventiva', 'Preditiva', 'Inspeção'],
      default: 'Corretiva'
    },
    prioridade: {
      type: String,
      enum: ['Alta', 'Média', 'Baixa'],
      default: 'Média'
    },
    status: {
      type: String,
      enum: ['Em Aberto', 'Em Andamento', 'Pendente', 'Concluída', 'Cancelada'],
      default: 'Em Aberto'
    },
    responsavel: {
      type: String,
      default: 'Não atribuído'
    },
    descricao: {
      type: String,
      required: [true, 'Descrição da falha/serviço é obrigatória']
    },
    dataAbertura: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10)
    },
    dataConclusao: {
      type: String,
      default: null
    },
    custoTotal: {
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

const OrdemServico = mongoose.model('OrdemServico', ordemServicoSchema);

module.exports = OrdemServico;
