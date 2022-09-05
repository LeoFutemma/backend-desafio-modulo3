const conexao = require('../../conexao');

async function excluirTransacao(req, res) {
  const { id } = req.params
  const { usuario } = req;

  try {
    const query = "SELECT * FROM transacoes WHERE id = $1 AND usuario_id = $2";
    const { rowCount } = await conexao.query(query, [id, usuario.id]);

    if (rowCount === 0) {
      return res.status(400).json({ mensagem: "Esta transação não existe ou não pertence à este usuário!" });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }

  try {
    const query = "DELETE FROM transacoes WHERE id = $1";
    const transacaoExcluida = await conexao.query(query, [id]);

    if (transacaoExcluida.rowCount === 0) {
      return res.status(400).json({ mensagem: "Não foi possível excluir a transação!" });
    }

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

module.exports = excluirTransacao;