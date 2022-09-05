const conexao = require('../../conexao');
const securePassword = require('secure-password');
const jwt = require('jsonwebtoken');
const segredo = require('../../segredo');

const pwd = securePassword();

async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: "É obrigatório informar o email e senha!" });
  }

  try {
    const query = "SELECT * FROM usuarios WHERE email = $1";
    const usuario = await conexao.query(query, [email]);

    if (usuario.rowCount === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado!" });
    }

    const usuarioEncontrado = usuario.rows[0];

    const resultado = await pwd.verify(
      Buffer.from(String(senha)),
      Buffer.from(usuarioEncontrado.senha, "hex"));

    switch (resultado) {
      case securePassword.INVALID_UNRECOGNIZED_HASH:
      case securePassword.INVALID:
        return res.status(400).json({ mensagem: "Email e/ou senha inválido(s)!" });
      case securePassword.VALID:
        break;
      case securePassword.VALID_NEEDS_REHASH:
        try {
          const hash = (await pwd.hash(Buffer.from(String(senha)))).toString("hex");
          const query = "UPDATE usuarios SET senha = $1 WHERE email = $2";
          await conexao.query(query, [hash, email])
        } catch { }
        break;
    }

    const token = jwt.sign({
      id: usuarioEncontrado.id
    }, segredo, { expiresIn: "4h" });

    return res.send({
      usuario: {
        id: usuarioEncontrado.id,
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email
      },
      token
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

module.exports = login;