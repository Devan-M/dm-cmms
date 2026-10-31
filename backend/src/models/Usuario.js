const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      trim: true,
      minlength: [3, 'Nome deve ter no mínimo 3 caracteres']
    },
    dataNascimento: {
      type: String,
      required: [true, 'Data de nascimento é obrigatória']
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email inválido']
    },
    senha: {
      type: String,
      required: [true, 'Senha é obrigatória'],
      minlength: [6, 'Senha deve ter no mínimo 6 caracteres']
    },
    perfil: {
      type: String,
      enum: ['admin', 'tecnico', 'supervisor'],
      default: 'tecnico'
    },
    ativo: {
      type: Boolean,
      default: true
    },
    tentativasLogin: {
      type: Number,
      default: 0
    },
    bloqueado: {
      type: Boolean,
      default: false
    },
    dataUltimoAcesso: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret.senha;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Middleware assíncrono pré-salvamento: criptografa a senha se modificada
usuarioSchema.pre('save', async function () {
  if (!this.isModified('senha')) return;
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

// Método para validar senha
usuarioSchema.methods.validarSenha = async function (senhaTexto) {
  return bcrypt.compare(senhaTexto, this.senha);
};

// Registra acesso bem-sucedido
usuarioSchema.methods.registrarAcesso = async function () {
  this.dataUltimoAcesso = new Date();
  this.tentativasLogin = 0;
  this.bloqueado = false;
  return this.save();
};

// Registra tentativa falha de login
usuarioSchema.methods.registrarTentativaFalha = async function () {
  this.tentativasLogin += 1;
  if (this.tentativasLogin >= 5) {
    this.bloqueado = true;
  }
  return this.save();
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
