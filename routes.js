module.exports = (function () {
  'use strict';
  var externalRoutes = require('express').Router();
  const querys = require('./querys.js');
  var sess;

  externalRoutes.get('/', (req, res) => {
    sess = req.session;
    if (sess.user) {
      res.redirect('../home')
    }
    else {
      res.render('login.html')
    }
  });

  externalRoutes.post('/', (req, res) => {
    querys.login(replaceAll(req.body.user, "'", "'+char(39)+'")
                ,replaceAll(req.body.password, "'", "'+char(39)+'"), res, req);
  });

  externalRoutes.get('/home', (req, res) => {
    sess = req.session;
    if (sess.user) {
      res.render('painel.html');
    }
    else {
      res.redirect('../');
    }
  });

  externalRoutes.get('/login', (req, res) => {
    res.render('falhalogin.html');
  });


  externalRoutes.get('/registrarChegada', (req, res) => {
    sess = req.session;
    if (sess.user) {
      res.render('chegada.html');
    }
    else {
      res.redirect('../');
    }
  });

  externalRoutes.post('/registrarChegada', (req, res) => {
    sess = req.session;
    if (sess.user) {
      var obs = "";
      var local = replaceAll(req.body.local.local, "'", "'+char(39)+'");
      if (req.body.hasOwnProperty('obs')) {
        obs = replaceAll(req.body.obs, "'", "'+char(39)+'");
      };
      querys.registrarChegada(req.body.codbarra, local, req.body.local.cd_localidade, obs, sess.user, res)
    }
    else {
      res.redirect('../');
    }
  });

  externalRoutes.get('/enviarItem', (req, res) => {
    sess = req.session;
    if (sess.user) {
      res.render('enviar.html');
    }
    else {
      res.redirect('../');
    }
  });

  externalRoutes.post('/enviarItem', (req, res) => {
    sess = req.session;
    if (sess.user) {
      var obs = "";
      var local = replaceAll(req.body.local.local, "'", "'+char(39)+'");
      if (req.body.hasOwnProperty('obs')) {
        obs = replaceAll(req.body.obs, "'", "'+char(39)+'");
      };
      querys.enviarItem(req.body.codbarra, local, obs, sess.user, res)
    }
    else {
      res.redirect('../');
    }
  });

  externalRoutes.get('/localizarItem', (req, res) => {
    sess = req.session;
    if (sess.user) {
      res.render('localizar.html');
    }
    else {
      res.redirect('../');
    }
  });

  externalRoutes.post('/localizarItem', (req, res) => {
    sess = req.session;
    if (sess.user) {
      var nome = "";
      if (req.body.hasOwnProperty('nome')) {
        nome = replaceAll(req.body.nome, "'", "'+char(39)+'");
      };
      if (req.body.hasOwnProperty('local') && req.body.local !== null) {
        querys.localizarItem(req.body.codbarra
          , nome
          , replaceAll(req.body.local.local, "'", "'+char(39)+'"), res);
      }
      else {
        querys.localizarItem(req.body.codbarra, nome, "", res);
      }
    }
    else {
      res.redirect('../');
    }
  });

  externalRoutes.get('/cadastrarItem', (req, res) => {
    sess = req.session;
    if (sess.user) {
      res.render('cadastrar.html');
    }
    else {
      res.redirect('../');
    }
  });

  externalRoutes.post('/cadastrarItem', (req, res) => {
    sess = req.session;
    if (sess.user) {
      var nome = replaceAll(req.body.nome, "'", "'+char(39)+'");
      var obs = ""
      if (req.body.hasOwnProperty("obs")) {
        obs = replaceAll(req.body.obs, "'", "'+char(39)+'");
      };
      querys.cadastrarItem(nome, req.body.codbarra, req.body.local.cd_localidade, obs, sess.user, res);
    }
    else {
      res.redirect('../');
    }
  });

  externalRoutes.post('/buscaItem', function (req, res) {
    sess = req.session;
    if (sess.user) {
      querys.buscaItem(req.body.codbarra, res);
    } else {
      res.redirect('../');
    }

  });

  externalRoutes.get('/editarItem', (req, res) => {
    sess = req.session;
    if (sess.user) {
      res.render('editar.html');
    }
    else {
      res.redirect('../');
    }
  });

  externalRoutes.post('/editarItem', (req, res) => {
    sess = req.session;
    if (sess.user) {
      var nome = replaceAll(req.body.nome, "'", "'+char(39)+'");
      var obs = replaceAll(req.body.obs, "'", "'+char(39)+'");
      querys.editarItem(req.body.codbarra, nome, obs, sess.user, res);
    }
    else {
      res.redirect('../');
    }
  });

  externalRoutes.get('/apagarItem', (req, res) => {
    sess = req.session;
    if (sess.user) {
      res.render('apagar.html');
    }
    else {
      res.redirect('../');
    }
  });

  externalRoutes.post('/apagarItem', (req, res) => {
    sess = req.session;
    if (sess.user) {
      var obs = ""
      if (req.body.hasOwnProperty("obs")) {
        obs = replaceAll(req.body.obs, "'", "'+char(39)+'");
      };
      querys.ApagarItem(req.body.codbarra, obs, sess.user, res);
    }
    else {
      res.redirect('../');
    }
  });

  externalRoutes.get('/localidades', function (req, res) {
    sess = req.session;
    if (sess.user) {
      querys.buscaLocalidade(sess.user, res);
    } else {
      res.redirect('../');
    }
  });

  externalRoutes.get('/criarUsuario', (req, res) => {
    sess = req.session;
    if (sess.user) {
      res.render('criarUsuario.html');
    }
    else {
      res.redirect('../');
    }
  });

  externalRoutes.post('/criarUsuario', (req, res) => {
    sess = req.session;
    if (sess.user) {
      var isAdmin = 0;
      if (req.body.isAdmin) {
        isAdmin = 1;
      }
      var nome = replaceAll(req.body.nome, "'", "'+char(39)+'");
      var login = replaceAll(req.body.login, "'", "'+char(39)+'");
      var senha = replaceAll(req.body.senha, "'", "'+char(39)+'");
      querys.criaUsuario(nome, login, senha, isAdmin, req.body.local.cd_localidade, res);
    }
    else {
      res.redirect('../');
    }
  });

  externalRoutes.get('/isAdmin', (req, res) => {
    sess = req.session;
    if (sess.user) {
      querys.isAdmin(replaceAll(sess.user, "'", "'+char(39)+'"), res);
    }
    else {
      res.redirect('../');
    }
  });


  externalRoutes.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      }
      else {
        res.redirect('/');
      }
    });
  });

  externalRoutes.post('/localizarItemExcel', (req, res) => {
    sess = req.session;
    if (sess.user) {
      var nome = "";
      if (req.body.hasOwnProperty('nome')) {
        nome = replaceAll(req.body.nome, "'", "'+char(39)+'");
      };
      if (req.body.hasOwnProperty('local') && req.body.local !== null) {
        querys.localizarItemExcel(req.body.codbarra
          , nome
          , replaceAll(req.body.local.local, "'", "'+char(39)+'"), res);
      }
      else {
        querys.localizarItemExcel(req.body.codbarra, nome, "", res);
      }
    }
    else {
      res.redirect('../');
    }
  });

  return externalRoutes;
})();

function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}