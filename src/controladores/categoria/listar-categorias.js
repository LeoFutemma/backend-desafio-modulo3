const conexao = require('../../conexao');

async function listarCategorias(req, res) {
  try {
    const categorias = await conexao.query("SELECT * FROM categorias");

    return res.json(categorias.rows);
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

module.exports = listarCategorias;