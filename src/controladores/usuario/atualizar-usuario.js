const conexao = require('../../conexao');
const securePassword = require('secure-password');

const pwd = securePassword();

async function atualizarUsuario(req, res) {
  const { nome, email, senha } = req.body;
  const { usuario } = req;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: "É obrigatório informar o nome, email e senha!" });
  }

  try {
    const query = "SELECT * FROM usuarios WHERE email = $1";
    const { rowCount: usuariosRows } = await conexao.query(query, [email]);

    if (usuariosRows > 0) {
      return res.status(400).json({ mensagem: "O e-mail informado já está sendo utilizado por outro usuário." });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }

  try {
    const hash = (await pwd.hash(Buffer.from(String(senha)))).toString("hex");

    const query = "UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4";
    const usuarioAtualizado = await conexao.query(query, [nome, email, hash, usuario.id]);

    if (usuarioAtualizado.rowCount === 0) {
      return res.status(400).json({ mensagem: "Erro na atualização do usuário!" });
    }

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

module.exports = atualizarUsuario;