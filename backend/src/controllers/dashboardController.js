const Equipamento = require('../models/Equipamento');
const OrdemServico = require('../models/OrdemServico');
const Usuario = require('../models/Usuario');

// GET - Resumo geral do CMMS para o Dashboard
const obterResumo = async (req, res) => {
  try {
    const totalEquipamentos = await Equipamento.countDocuments();
    const equipamentosOperacionais = await Equipamento.countDocuments({ status: 'Operacional' });
    const equipamentosManutencao = await Equipamento.countDocuments({ status: 'Em Manutenção' });

    const totalOrdens = await OrdemServico.countDocuments();
    const ordensAbertas = await OrdemServico.countDocuments({ status: 'Em Aberto' });
    const ordensAndamento = await OrdemServico.countDocuments({ status: 'Em Andamento' });
    const ordensConcluidas = await OrdemServico.countDocuments({ status: 'Concluída' });

    const totalUsuarios = await Usuario.countDocuments();

    const disponibilidadeGeral = totalEquipamentos > 0 
      ? ((equipamentosOperacionais / totalEquipamentos) * 100).toFixed(1) + '%' 
      : '100%';

    return res.json({
      sucesso: true,
      indicadores: {
        totalEquipamentos,
        equipamentosOperacionais,
        equipamentosManutencao,
        disponibilidadeGeral,
        totalOrdens,
        ordensAbertas,
        ordensAndamento,
        ordensConcluidas,
        totalUsuarios
      }
    });
  } catch (erro) {
    return res.status(500).json({
      sucesso: false,
      mensagem: erro.message
    });
  }
};

module.exports = {
  obterResumo
};
