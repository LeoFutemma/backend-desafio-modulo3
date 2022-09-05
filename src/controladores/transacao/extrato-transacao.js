const conexao = require('../../conexao');

async function ObterExtratoTransacoes(req, res) {
  const { usuario } = req;
  let entrada = 0;
  let saida = 0;

  try {
    const query = "SELECT SUM(valor) FROM transacoes WHERE usuario_id = $1 AND tipo = $2";
    const { rows } = await conexao.query(query, [usuario.id, "entrada"]);

    if (rows[0].sum !== null) {
      entrada = Number(rows[0].sum);
    }

  } catch (error) {
    return res.status(500).json(error.message);
  }

  try {
    const query = "SELECT SUM(valor) FROM transacoes WHERE usuario_id = $1 AND tipo = $2";
    const { rows } = await conexao.query(query, [usuario.id, "saida"]);

    if (rows[0].sum !== null) {
      saida = Number(rows[0].sum);
    }

  } catch (error) {
    return res.status(500).json(error.message);
  }

  return res.json({ entrada, saida });
}

module.exports = ObterExtratoTransacoes;