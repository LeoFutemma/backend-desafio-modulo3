const conexao = require('../../conexao');

async function atualizarTransacao(req, res) {
  const { descricao, valor, data, categoria_id, tipo } = req.body;
  const { id } = req.params
  const { usuario } = req;

  if (!descricao || !valor || !data || !categoria_id || !tipo) {
    return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." });
  }

  if (tipo !== "entrada" && tipo !== "saída" && tipo !== "saida") {
    return res.status(400).json({ mensagem: "O tipo deve ser declarado apenas como 'entrada' ou 'saida'" });
  }

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
    const query = "SELECT * FROM categorias WHERE id = $1";
    const { rowCount } = await conexao.query(query, [categoria_id]);

    if (rowCount === 0) {
      return res.status(400).json({ mensagem: "A categoria informada não existe!" });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }

  try {
    const query = "UPDATE transacoes SET descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 WHERE id = $6";
    const transacaoAtualizada = await conexao.query(query, [descricao, valor, data, categoria_id, tipo, id]);

    if (transacaoAtualizada.rowCount === 0) {
      return res.status(400).json({ mensagem: "Erro na atualização da transação!" });
    }

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

module.exports = atualizarTransacao;