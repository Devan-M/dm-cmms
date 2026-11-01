const OrdemServico = require('../models/OrdemServico');
const Equipamento = require('../models/Equipamento');

// POST - Criar nova Ordem de Serviço
const criarOrdem = async (req, res) => {
  try {
    const { codigoEquipamento, tipo, prioridade, responsavel, descricao } = req.body;

    if (!codigoEquipamento || !descricao) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Código do equipamento e descrição são obrigatórios'
      });
    }

    // Busca o equipamento correspondente (se existir)
    const eq = await Equipamento.findOne({ codigo: codigoEquipamento.toUpperCase() });
    const nomeEquipamento = eq ? eq.nome : req.body.nomeEquipamento || 'Equipamento não especificado';

    // Gera número sequencial automático
    const ultimaOS = await OrdemServico.findOne().sort({ numero: -1 });
    const proximoNumero = ultimaOS ? ultimaOS.numero + 1 : 1001;

    const novaOS = await OrdemServico.create({
      numero: proximoNumero,
      equipamento: eq ? eq._id : undefined,
      codigoEquipamento: codigoEquipamento.toUpperCase(),
      nomeEquipamento,
      tipo,
      prioridade,
      responsavel,
      descricao
    });

    // Se a OS for corretiva, atualiza status do equipamento para "Em Manutenção"
    if (eq && tipo === 'Corretiva') {
      eq.status = 'Em Manutenção';
      await eq.save();
    }

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Ordem de Serviço criada com sucesso',
      ordem: novaOS.toJSON()
    });
  } catch (erro) {
    return res.status(400).json({
      sucesso: false,
      mensagem: erro.message
    });
  }
};

// GET - Listar Ordens de Serviço (com filtros opcionais)
const listarOrdens = async (req, res) => {
  try {
    const { status, prioridade, tipo } = req.query;
    const filtro = {};

    if (status) filtro.status = status;
    if (prioridade) filtro.prioridade = prioridade;
    if (tipo) filtro.tipo = tipo;

    const ordens = await OrdemServico.find(filtro).sort({ numero: -1 });

    return res.json({
      sucesso: true,
      total: ordens.length,
      ordens: ordens.map(o => o.toJSON())
    });
  } catch (erro) {
    return res.status(500).json({
      sucesso: false,
      mensagem: erro.message
    });
  }
};

// GET - Obter OS por ID
const obterOrdem = async (req, res) => {
  try {
    const { id } = req.params;
    const ordem = await OrdemServico.findById(id);

    if (!ordem) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Ordem de Serviço não encontrada'
      });
    }

    return res.json({
      sucesso: true,
      ordem: ordem.toJSON()
    });
  } catch (erro) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'ID inválido ou erro na busca'
    });
  }
};

// PUT - Atualizar OS (status, responsável, conclusão, etc.)
const atualizarOrdem = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    if (dados.status === 'Concluída' && !dados.dataConclusao) {
      dados.dataConclusao = new Date().toISOString().slice(0, 10);
    }

    const ordem = await OrdemServico.findByIdAndUpdate(id, dados, {
      returnDocument: 'after',
      runValidators: true
    });

    if (!ordem) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Ordem de Serviço não encontrada'
      });
    }

    // Se concluiu a OS, restaura status do equipamento para "Operacional"
    if (dados.status === 'Concluída' && ordem.codigoEquipamento) {
      await Equipamento.findOneAndUpdate(
        { codigo: ordem.codigoEquipamento },
        { status: 'Operacional' }
      );
    }

    return res.json({
      sucesso: true,
      mensagem: 'Ordem de Serviço atualizada com sucesso',
      ordem: ordem.toJSON()
    });
  } catch (erro) {
    return res.status(400).json({
      sucesso: false,
      mensagem: erro.message
    });
  }
};

// DELETE - Deletar OS
const deletarOrdem = async (req, res) => {
  try {
    const { id } = req.params;
    const ordem = await OrdemServico.findByIdAndDelete(id);

    if (!ordem) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Ordem de Serviço não encontrada'
      });
    }

    return res.json({
      sucesso: true,
      mensagem: 'Ordem de Serviço removida com sucesso'
    });
  } catch (erro) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'ID inválido ou erro ao remover'
    });
  }
};

module.exports = {
  criarOrdem,
  listarOrdens,
  obterOrdem,
  atualizarOrdem,
  deletarOrdem
};
