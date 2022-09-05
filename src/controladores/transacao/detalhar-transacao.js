const conexao = require('../../conexao');

async function detalharTransacao(req, res) {
  const { id } = req.params;
  const { usuario } = req;

  try {
    const query = `SELECT t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome FROM transacoes t
    LEFT JOIN categorias c ON t.categoria_id = c.id
    WHERE t.id = $1 
    AND usuario_id = $2`;
    const { rows, rowCount } = await conexao.query(query, [id, usuario.id]);

    if (rowCount === 0) {
      return res.status(400).json({ mensagem: "Esta transação não existe ou não pertence à este usuário!" });
    }

    return res.json(rows);
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

module.exports = detalharTransacao;