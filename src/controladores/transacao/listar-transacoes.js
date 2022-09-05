const conexao = require("../../conexao");

async function listarTransacoes(req, res) {
  const { usuario } = req;
  const filtro = req.query.filtro;

  try {
    const query = `SELECT t.id, t.tipo, t.descricao, t.valor, TO_CHAR(t.data, 'MM/DD/YY') as data, EXTRACT(DOW FROM t.data) AS dia_semana, 
      CASE EXTRACT(DOW FROM t.data)
        WHEN 0 THEN 'Domingo'
        WHEN 1 THEN 'Segunda'
        WHEN 2 THEN 'Terça'
        WHEN 4 THEN 'Quinta'
        WHEN 5 THEN 'Sexta'
        WHEN 6 THEN 'Sábado'
      END AS dia_semana,
    t.usuario_id, t.categoria_id, c.descricao AS  categoria_nome FROM transacoes t
    LEFT JOIN categorias c ON t.categoria_id = c.id
    WHERE usuario_id = $1`;
    const { rows } = await conexao.query(query, [usuario.id]);

    if (filtro) {
      const transacoes = rows;
      const transacoesPorCategorias = [];

      transacoes.filter((element) => {
        if (filtro.includes(element.categoria_nome)) {
          transacoesPorCategorias.push(element);
        }
      });
      return res.json(transacoesPorCategorias);
    }

    return res.json(rows);
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

module.exports = listarTransacoes;
