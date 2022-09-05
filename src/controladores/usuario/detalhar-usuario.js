function detalharUsuario(req, res) {
  const { usuario } = req;

  return res.json({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email
  });
}

module.exports = detalharUsuario;