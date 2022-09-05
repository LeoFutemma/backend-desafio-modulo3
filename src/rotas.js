const express = require('express');
const cadastrarUsuario = require('./controladores/usuario/cadastrar-usuario');
const login = require('./controladores/usuario/login');
const verificaLogin = require('./filtros/verifica-login');
const detalharUsuario = require('./controladores/usuario/detalhar-usuario');
const atualizarUsuario = require('./controladores/usuario/atualizar-usuario');
const listarCategorias = require('./controladores/categoria/listar-categorias');
const listarTransacoes = require('./controladores/transacao/listar-transacoes');
const detalharTransacao = require('./controladores/transacao/detalhar-transacao');
const cadastrarTransacao = require('./controladores/transacao/cadastrar-transacao');
const atualizarTransacao = require('./controladores/transacao/atualizar-transacao');
const excluirTransacao = require('./controladores/transacao/excluir-transacao');
const ObterExtratoTransacoes = require('./controladores/transacao/extrato-transacao');

const rotas = express();

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);

rotas.use(verificaLogin);

rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', atualizarUsuario);

rotas.get('/categoria', listarCategorias);

rotas.get('/transacao', listarTransacoes);
rotas.get('/transacao/extrato', ObterExtratoTransacoes);
rotas.get('/transacao/:id', detalharTransacao);
rotas.post('/transacao', cadastrarTransacao);
rotas.put('/transacao/:id', atualizarTransacao);
rotas.delete('/transacao/:id', excluirTransacao);

module.exports = rotas;