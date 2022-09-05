const conexao = require('../../conexao');

async function cadastrarTransacao(req, res) {
  const { descricao, valor, data, categoria_id, tipo } = req.body;
  const { usuario } = req;

  if (!descricao || !valor || !data || !categoria_id || !tipo) {
    return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." });
  }

  if (tipo !== "entrada" && tipo !== "saida") {
    return res.status(400).json({ mensagem: "O tipo deve ser declarado apenas como 'entrada' ou 'saida'" });
  }

  try {
    const query = "SELECT * FROM categorias WHERE id = $1";
    const { rowCount } = await conexao.query(query, [categoria_id]);

    if (rowCount === 0) {
      return res.status(400).json({ mensagem: "A categoria informada não existe!" });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }

  try {
    const query = `INSERT INTO transacoes
    (descricao, valor, data, categoria_id, usuario_id, tipo)
    VALUES ($1, $2, $3, $4, $5, $6)`;
    const transacaoCadastrada = await conexao.query(query, [descricao, valor, data, categoria_id, usuario.id, tipo]);

    if (transacaoCadastrada.rowCount === 0) {
      return res.status(400).json({ mensagem: "Erro no cadastro da transação!" });
    }
  } catch (error) {
    return res.status(500).json(error.message)
  }

  try {
    const query = `SELECT t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome FROM transacoes t
    LEFT JOIN categorias c ON t.categoria_id = c.id
    WHERE usuario_id = $1`;
    const { rows } = await conexao.query(query, [usuario.id]);

    return res.status(201).json(rows[rows.length - 1]);
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

module.exports = cadastrarTransacao;