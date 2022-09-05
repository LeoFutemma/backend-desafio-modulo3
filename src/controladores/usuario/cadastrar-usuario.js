const conexao = require('../../conexao');
const securePassword = require('secure-password');

const pwd = securePassword();

async function cadastrarUsuario(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: "É obrigatório informar o nome, email e senha!" });
  }

  try {
    const query = "SELECT * FROM usuarios WHERE email = $1";
    const { rowCount: usuariosRows } = await conexao.query(query, [email]);

    if (usuariosRows > 0) {
      return res.status(400).json({ mensagem: "Já existe usuário cadastrado com o e-mail informado." });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }

  try {
    const hash = (await pwd.hash(Buffer.from(String(senha)))).toString("hex");

    const query = "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)";
    const usuarioCadastrado = await conexao.query(query, [nome, email, hash]);

    if (usuarioCadastrado.rowCount === 0) {
      return res.status(400).json({ mensagem: "Erro no cadastro do usuário!" });
    }
  } catch (error) {
    return res.status(500).json(error.message)
  }

  try {
    const query = "SELECT id, nome, email FROM usuarios WHERE email = $1";
    const usuarioCadastrado = await conexao.query(query, [email]);

    return res.status(201).json(usuarioCadastrado.rows[0]);
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

module.exports = cadastrarUsuario;