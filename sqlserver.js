const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sql = require('mssql');
const config = {
    user: 'holocracia.sistema',
    password: 'sistema1234',
    server: 'localhost\\holocracy',
    database: 'SKA_INVENTARIO',
}

//fazendo a conexão global
sql.connect(config)
   .then(conn => global.conn = conn)
   .catch(err => console.log(err));

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function execSQLQuery(sqlQry, res){
    global.conn.request()
               .query(sqlQry)
               .then((result) => {
                    if (result.recordset.length > 0)
                    res.json(result.recordset)
                    else
                    res.json({failed: true})
                })
               .catch(err => res.json(err));
}

module.exports = {
  execSQLQuery: execSQLQuery
}