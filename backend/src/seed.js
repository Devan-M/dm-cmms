require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');
const Equipamento = require('./models/Equipamento');
const OrdemServico = require('./models/OrdemServico');

// Lista base de usuários demo
const usuariosIniciais = [
  { nome: 'Administrador Demo', email: 'demo@teste.com', perfil: 'admin' },
  { nome: 'Carlos Melo', email: 'carlos@dm-cmms.com', perfil: 'tecnico' },
  { nome: 'Ana Silva', email: 'ana@dm-cmms.com', perfil: 'tecnico' },
  { nome: 'Pedro Costa', email: 'pedro@dm-cmms.com', perfil: 'tecnico' },
  { nome: 'Mariana Santos Rocha', email: 'mariana.rocha@dm-cmms.com', perfil: 'supervisor' },
  { nome: 'Lucas Gabriel Oliveira', email: 'lucas.oliveira@dm-cmms.com', perfil: 'tecnico' },
  { nome: 'Roberto Souza Filho', email: 'roberto.filho@dm-cmms.com', perfil: 'tecnico' },
  { nome: 'Juliana Cristina Lima', email: 'juliana.lima@dm-cmms.com', perfil: 'supervisor' },
  { nome: 'Fernando Alves Moreira', email: 'fernando.moreira@dm-cmms.com', perfil: 'tecnico' },
  { nome: 'Beatriz Nogueira Duarte', email: 'beatriz.duarte@dm-cmms.com', perfil: 'admin' },
  { nome: 'Rodrigo Mendes Ribeiro', email: 'rodrigo.ribeiro@dm-cmms.com', perfil: 'tecnico' },
  { nome: 'Camila Ferreira Ramos', email: 'camila.ramos@dm-cmms.com', perfil: 'tecnico' },
  { nome: 'Marcelo Antunes Vieira', email: 'marcelo.vieira@dm-cmms.com', perfil: 'tecnico' },
  { nome: 'Vanessa Castro Toledo', email: 'vanessa.toledo@dm-cmms.com', perfil: 'supervisor' },
  { nome: 'Diego Martins Guimarães', email: 'diego.guimaraes@dm-cmms.com', perfil: 'tecnico' },
  { nome: 'Renata Barbosa Cunha', email: 'renata.cunha@dm-cmms.com', perfil: 'tecnico' },
  { nome: 'Felipe Araújo Pires', email: 'felipe.pires@dm-cmms.com', perfil: 'tecnico' },
  { nome: 'Patrícia Farias Cardoso', email: 'patricia.cardoso@dm-cmms.com', perfil: 'supervisor' },
  { nome: 'Thiago Monteiro Braga', email: 'thiago.braga@dm-cmms.com', perfil: 'tecnico' },
  { nome: 'Amanda Correia Dias', email: 'amanda.dias@dm-cmms.com', perfil: 'admin' },
  { nome: 'Guilherme Peixoto Prado', email: 'guilherme.prado@dm-cmms.com', perfil: 'tecnico' },
  { nome: 'Larissa Borges Machado', email: 'larissa.machado@dm-cmms.com', perfil: 'tecnico' },
  { nome: 'Vinícius Tavares Campos', email: 'vinicius.campos@dm-cmms.com', perfil: 'tecnico' },
  { nome: 'Tatiane Rezende Freitas', email: 'tatiane.freitas@dm-cmms.com', perfil: 'tecnico' },
  { nome: 'Bruno Medeiros Carvalho', email: 'bruno.carvalho@dm-cmms.com', perfil: 'tecnico' }
];

const setores = ['Usinagem', 'Estamparia', 'Utilidades', 'Logística', 'Moldagem', 'Geral'];
const criticidades = ['Alta', 'Média', 'Baixa'];
const statusEquipamentos = ['Operacional', 'Em Manutenção', 'Inativo'];

const maquinasBase = [
  'Torno CNC', 'Centro de Usinagem', 'Fresadora Universal', 'Retífica Cilíndrica',
  'Prensa Hidráulica', 'Prensa Excêntrica', 'Guilhotina Industrial', 'Dobradeira CNC',
  'Compressor de Ar Parafuso', 'Caldeira a Vapor', 'Chiller de Água Gelada', 'Torre de Resfriamento',
  'Ponte Rolante', 'Empilhadeira Elétrica', 'Esteira Transportadora', 'Robô Paletizador',
  'Injetora de Plástico', 'Extrusora Dupla Rosca', 'Sopradora Automática', 'Misturador Industrial'
];

const fabricantes = ['Siemens', 'Romi', 'WEG', 'Atlas Copco', 'Schneider', 'Fanuc', 'Kuka', 'Schuler'];

const tiposOS = ['Corretiva', 'Preventiva', 'Preditiva', 'Inspeção'];
const prioridadesOS = ['Alta', 'Média', 'Baixa'];
const statusOS = ['Em Aberto', 'Em Andamento', 'Concluída', 'Cancelada', 'Pendente'];

const falhasDescricoes = [
  'Vibração excessiva nos mancais do motor principal.',
  'Vazamento de fluido hidráulico na válvula direcional.',
  'Superaquecimento do rolamento durante operação contínua.',
  'Troca preventiva de óleo lubrificante e elementos filtrantes.',
  'Substituição de correias desgastadas e alinhamento de polias.',
  'Calibração de sensores ópticos de posicionamento e fim de curso.',
  'Falha intermitente no inversor de frequência com código de erro F001.',
  'Ruído anormal na caixa de engrenagens durante aceleração.',
  'Inspeção visual e reaperto dos bornes elétricos no painel de comando.',
  'Ajuste de folga no barramento longitudinal e lubrificação das guias.'
];

async function seedCompleto() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dm-cmms';
  await mongoose.connect(uri, { family: 4 });
  console.log('⚡ Conectado ao MongoDB. Iniciando Seed Geral...');

  // 1. SEED DE USUÁRIOS
  console.log('\n--- 1. Processando Usuários ---');
  for (const dados of usuariosIniciais) {
    const existente = await Usuario.findOne({ email: dados.email });
    if (!existente) {
      await Usuario.create({
        ...dados,
        dataNascimento: '1995-05-15',
        senha: 'Admin123',
        ativo: true
      });
      console.log(`+ Usuário criado: ${dados.email}`);
    }
  }
  const totalUsuarios = await Usuario.countDocuments();
  console.log(`✔ Total de usuários no banco: ${totalUsuarios}`);

  // 2. SEED DE EQUIPAMENTOS (150 itens)
  console.log('\n--- 2. Processando Equipamentos ---');
  const totalEquip = 150;
  for (let i = 1; i <= totalEquip; i++) {
    const padNum = String(i).padStart(3, '0');
    const codigo = `EQP-${padNum}`;

    const maquina = maquinasBase[(i - 1) % maquinasBase.length];
    const setor = setores[(i - 1) % setores.length];
    const criticidade = criticidades[(i - 1) % criticidades.length];
    const status = statusEquipamentos[i % 10 === 0 ? 1 : (i % 25 === 0 ? 2 : 0)];
    const fabricante = fabricantes[(i - 1) % fabricantes.length];

    await Equipamento.updateOne(
      { codigo },
      {
        $set: {
          codigo,
          nome: `${maquina} #${padNum}`,
          setor,
          criticidade,
          status,
          fabricante,
          modelo: `MD-${padNum}`,
          localizacao: `Galpão ${String.fromCharCode(65 + (i % 4))} - Linha ${(i % 6) + 1}`,
          dataCadastro: new Date(Date.now() - (totalEquip - i) * 86400000).toLocaleDateString('pt-BR')
        }
      },
      { upsert: true }
    );
  }
  const totalEquipamentos = await Equipamento.countDocuments();
  console.log(`✔ Total de equipamentos no banco: ${totalEquipamentos}`);

  // 3. SEED DE ORDENS DE SERVIÇO (100 ordens)
  console.log('\n--- 3. Processando Ordens de Serviço ---');
  const equipamentos = await Equipamento.find().limit(totalEquip);
  const tecnicos = usuariosIniciais.filter(u => u.perfil !== 'admin').map(u => u.nome);

  const ultimaOS = await OrdemServico.findOne().sort({ numero: -1 });
  let proximoNumero = ultimaOS ? ultimaOS.numero + 1 : 1001;

  const totalOrdens = 100;
  for (let i = 0; i < totalOrdens; i++) {
    const eq = equipamentos[i % equipamentos.length];
    const tipo = tiposOS[i % tiposOS.length];
    const prioridade = prioridadesOS[i % prioridadesOS.length];
    const status = statusOS[i % statusOS.length];
    const responsavel = status === 'Em Aberto' && i % 3 === 0 ? 'Não atribuído' : tecnicos[i % tecnicos.length];
    const descricao = falhasDescricoes[i % falhasDescricoes.length];

    const diasAtras = (totalOrdens - i) * 2;
    const dataAbertura = new Date(Date.now() - diasAtras * 86400000).toISOString().slice(0, 10);
    const dataConclusao = (status === 'Concluída' || status === 'Cancelada')
      ? new Date(Date.now() - (diasAtras - 2) * 86400000).toISOString().slice(0, 10)
      : null;

    const osNumero = proximoNumero++;

    await OrdemServico.updateOne(
      { numero: osNumero },
      {
        $set: {
          numero: osNumero,
          equipamento: eq._id,
          codigoEquipamento: eq.codigo,
          nomeEquipamento: eq.nome,
          tipo,
          prioridade,
          status,
          responsavel,
          descricao: `${descricao} (${eq.codigo})`,
          dataAbertura,
          dataConclusao,
          custoTotal: (i + 1) * 75
        }
      },
      { upsert: true }
    );
  }
  const totalOS = await OrdemServico.countDocuments();
  console.log(`✔ Total de ordens de serviço no banco: ${totalOS}`);

  console.log('\n🎉 Seed unificado concluído com sucesso!');
  await mongoose.disconnect();
}

seedCompleto().catch((erro) => {
  console.error('❌ Falha ao rodar seed completo:', erro);
  process.exit(1);
});
