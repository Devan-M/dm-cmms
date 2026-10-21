
class UsuarioService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  criar(nome, dataNascimento, email, senha, perfil = 'tecnico') {
    return this.usuarioRepository.criar(
      nome,
      dataNascimento,
      email,
      senha,
      perfil
    );
  }

  listar() {
    return this.usuarioRepository.listar();
  }
}

module.exports = UsuarioService;
