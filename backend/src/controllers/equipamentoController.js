const Equipamento = require('../models/Equipamento');

// POST - Criar equipamento
const criarEquipamento = async (req, res) => {
  try {
    const { codigo, nome, setor, criticidade, status, fabricante, modelo, localizacao, tensao, dataInstalacao } = req.body;

    if (!codigo || !nome || !setor) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Código, nome e setor são obrigatórios'
      });
    }

    const existente = await Equipamento.findOne({ codigo: codigo.toUpperCase() });
    if (existente) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Já existe um equipamento cadastrado com este código'
      });
    }

    const equipamento = await Equipamento.create({
      codigo,
      nome,
      setor,
      criticidade,
      status,
      fabricante,
      modelo,
      localizacao,
      tensao,
      dataInstalacao
    });

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Equipamento cadastrado com sucesso',
      equipamento: equipamento.toJSON()
    });
  } catch (erro) {
    return res.status(400).json({
      sucesso: false,
      mensagem: erro.message
    });
  }
};

// GET - Listar todos os equipamentos (com filtro opcional por setor ou status)
const listarEquipamentos = async (req, res) => {
  try {
    const { setor, status } = req.query;
    const filtro = {};

    if (setor) filtro.setor = setor;
    if (status) filtro.status = status;

    const equipamentos = await Equipamento.find(filtro).sort({ codigo: 1 });

    return res.json({
      sucesso: true,
      total: equipamentos.length,
      equipamentos: equipamentos.map(e => e.toJSON())
    });
  } catch (erro) {
    return res.status(500).json({
      sucesso: false,
      mensagem: erro.message
    });
  }
};

// GET - Obter equipamento por ID
const obterEquipamento = async (req, res) => {
  try {
    const { id } = req.params;
    const equipamento = await Equipamento.findById(id);

    if (!equipamento) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Equipamento não encontrado'
      });
    }

    return res.json({
      sucesso: true,
      equipamento: equipamento.toJSON()
    });
  } catch (erro) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'ID inválido ou erro na busca'
    });
  }
};

// PUT - Atualizar equipamento
const atualizarEquipamento = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    const equipamento = await Equipamento.findByIdAndUpdate(id, dados, {
      returnDocument: 'after',
      runValidators: true
    });

    if (!equipamento) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Equipamento não encontrado'
      });
    }

    return res.json({
      sucesso: true,
      mensagem: 'Equipamento atualizado com sucesso',
      equipamento: equipamento.toJSON()
    });
  } catch (erro) {
    return res.status(400).json({
      sucesso: false,
      mensagem: erro.message
    });
  }
};

// DELETE - Deletar equipamento
const deletarEquipamento = async (req, res) => {
  try {
    const { id } = req.params;
    const equipamento = await Equipamento.findByIdAndDelete(id);

    if (!equipamento) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Equipamento não encontrado'
      });
    }

    return res.json({
      sucesso: true,
      mensagem: 'Equipamento removido com sucesso'
    });
  } catch (erro) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'ID inválido ou erro ao remover'
    });
  }
};

module.exports = {
  criarEquipamento,
  listarEquipamentos,
  obterEquipamento,
  atualizarEquipamento,
  deletarEquipamento
};
