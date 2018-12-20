const sqlserver = require('./sqlserver.js');

exports.login = (user, password, res, req) => {
    global.conn.request()
        .query(`select * from usuario where ds_login = '${user}' and CONVERT(VARCHAR(32),HASHBYTES('MD5','${password}'),2) = ds_senha`)
        .then((result) => {
            retorno = result.recordset;
            if (retorno.length > 0) {
                sess = req.session
                sess.user = req.body.user;
                res.redirect('../home');
            } else
                res.redirect('../login');
        })
        .catch(err => res.json(err));
};

exports.buscaLocalidade = (user, res) => {
    sqlserver.execSQLQuery(`select loc.cd_localidade, loc.ds_descricao local ,usr.ds_login 
    from localidade loc left join usuario usr on usr.cd_localidade = loc.cd_localidade 
    and usr.ds_login = '${user}' order by usr.ds_login desc, loc.ds_descricao asc`, res);
};

exports.isAdmin = (user, res) => {
    sqlserver.execSQLQuery(`select isAdmin from usuario where ds_login = '${user}'`, res);
};

exports.cadastrarItem = (nome, codbarra, local, obs, user, res) => {
    sqlserver.execSQLQuery(`DECLARE @Item INT
    set @Item = (select distinct 1 from item where cd_barra = '${codbarra}' OR nm_nome = '${nome}')
    IF @Item IS NULL
        BEGIN 
            insert into item (nm_nome,cd_barra,cd_localidade_origem,cd_localidade_atual,ds_obs)
                    VALUES ('${nome}','${codbarra}',${local},${local},'${obs}')
            insert into rastreio (nm_nome,cd_barra,ds_localidade_atual,ds_situacao,ds_obs,cd_usuario,dt_rastreio)
            select 
            nm_nome 
            ,'${codbarra}'
            ,loc.ds_descricao
            ,'Item cadastrado por ${user}'
            ,'${obs}'
            ,(select cd_usuario from usuario where ds_login = '${user}')
            ,getdate()
            from
            item obj join LOCALIDADE loc
            on obj.cd_localidade_atual = loc.cd_localidade
            where obj.cd_barra = '${codbarra}' 
            
            select nm_nome from item where cd_barra = '${codbarra}'
        END
    ELSE 
        SELECT top(1) CASE WHEN cd_barra = '${codbarra}' 
                           THEN 0
                           WHEN nm_nome = '${nome}'
                           THEN 1
                      END as nm_nome
        FROM item where cd_barra = '${codbarra}' or nm_nome = '${nome}' order by cd_item`, res)
};

exports.buscaItem = (codbarra, res) => {
    sqlserver.execSQLQuery(`select * from item where cd_barra = '${codbarra}'`, res);
};

exports.editarItem = (codbarra, nome, obs, user, res) => {
    sqlserver.execSQLQuery('insert into rastreio (nm_nome,cd_barra,ds_localidade_atual,ds_situacao,ds_obs,cd_usuario,dt_rastreio) ' +
                            `select 
                            nm_nome
                            ,'${codbarra}'
                            ,loc.ds_descricao
                            ,'Item editado por ${user}'
                            ,case when obj.nm_nome != '${nome}' and convert(varchar(max),obj.ds_obs) != '${obs}' 
                                then 'Nome do item alterado de '+obj.nm_nome+' para ${nome}.'+char(10)+char(13)+'A observação do objeto também foi alterada'
                                when obj.nm_nome != '${nome}'
                                then 'Nome do item alterado de '+obj.nm_nome+' para ${nome}.'
                                else 'Somente a observação do objeto foi alterada'
                            End
                            ,(select cd_usuario from usuario where ds_login = '${user}')
                            ,getdate()
                            from
                            item obj join LOCALIDADE loc
                            on obj.cd_localidade_atual = loc.cd_localidade
                            where obj.cd_barra = '${codbarra}'
                            
                            update item set nm_nome = '${nome}', ds_obs = '${obs}' where cd_barra = '${codbarra}'
                            
                            select 1 att from item where cd_barra = '${codbarra}' and nm_nome = '${nome}' and convert(varchar(max),ds_obs) = '${obs}'`, res)

};


exports.enviarItem = (codbarra, localidade, observacao, user, res) => {
    sqlserver.execSQLQuery('insert into rastreio (nm_nome,cd_barra,ds_localidade_atual,ds_situacao,ds_obs,cd_usuario,dt_rastreio) ' +
        `select 
                 nm_nome
                ,'${codbarra}'
                ,loc.ds_descricao
                ,'Indo para ${localidade}'
                ,'${observacao}'
                ,(select cd_usuario from usuario where ds_login = '${user}')
                ,getdate()
               from
               item obj join LOCALIDADE loc
               on obj.cd_localidade_atual = loc.cd_localidade
               where obj.cd_barra = '${codbarra}'`, res);
}


exports.registrarChegada = (codbarra, localidade, idlocal, observacao, user, res) => {
    sqlserver.execSQLQuery(`update item set cd_localidade_atual = ${idlocal} where cd_barra = '${codbarra}' ` +
        'insert into rastreio (nm_nome,cd_barra,ds_localidade_atual,ds_situacao,ds_obs,cd_usuario,dt_rastreio) ' +
        `select 
                 nm_nome 
                ,'${codbarra}'
                ,loc.ds_descricao
                ,'Chegou em ${localidade}'
                ,'${observacao}'
                ,(select cd_usuario from usuario where ds_login = '${user}')
                ,getdate()
               from
               item obj join LOCALIDADE loc
               on obj.cd_localidade_atual = loc.cd_localidade
               where obj.cd_barra = '${codbarra}'`, res)
}

exports.localizarItem = (codbarra, nome, local, res) => {
    sqlserver.execSQLQuery(`SELECT top(1000) rat.cd_rastreio,rat.cd_barra,rat.nm_nome,rat.ds_localidade_atual,CONVERT(VARCHAR(MAX),rat.ds_situacao) ds_situacao
                            ,CONVERT(VARCHAR(MAX),rat.ds_obs) ds_obs
                            ,usr.nm_nome usuario
                            ,convert(varchar,rat.dt_rastreio,103)+' '+convert(varchar(5),convert(time,rat.dt_rastreio)) dt_rastreio
                            from RASTREIO rat
                            join usuario usr on usr.cd_usuario = rat.cd_usuario
                            where
                                rat.cd_barra = '${codbarra}'
                            OR (rat.nm_nome like '%${nome}%' and '${nome}' != '')
                            UNION
                            select
                            rat.cd_rastreio,it.cd_barra,it.nm_nome,loc.ds_descricao,CONVERT(VARCHAR(MAX),rat.ds_situacao) ds_situacao
                            ,CONVERT(VARCHAR(MAX),rat.ds_obs) ds_obs
                            ,(select nm_nome from usuario usr where usr.cd_usuario = rat.cd_usuario) usuario
                            ,convert(varchar,rat.dt_rastreio,103)+' '+convert(varchar(5),convert(time,rat.dt_rastreio)) dt_rastreio
                            from
                            item it join localidade loc on loc.cd_localidade = it.cd_localidade_atual
                                join rastreio rat on rat.cd_barra = it.cd_barra and rat.ds_localidade_atual = loc.ds_descricao 
                                and (rat.ds_situacao like 'Chegou em %' or rat.ds_situacao like 'Item cadastrado%') 
                            where loc.ds_descricao = '${local}'
                            order by rat.cd_rastreio desc`, res)
}

exports.localizarItemExcel = (codbarra, nome, local, res) => {
    global.conn.request()
        .query(`SELECT top(1000) rat.cd_rastreio,rat.cd_barra,rat.nm_nome,rat.ds_localidade_atual,rat.ds_situacao,rat.ds_obs
                ,usr.nm_nome funcionario
                ,convert(varchar,rat.dt_rastreio,103)+' '+convert(varchar(5),convert(time,rat.dt_rastreio)) horario
                from RASTREIO rat
                join usuario usr on usr.cd_usuario = rat.cd_usuario
                where
                    rat.cd_barra = '${codbarra}'
                OR (rat.nm_nome like '%${nome}%' and '${nome}' != '')
                OR rat.ds_localidade_atual = '${local}'`)
        .then((result) => {
            retorno = result.recordset;
            if (retorno.length > 0) {
                res.xls('data.xlsx', retorno);
            } else
                res.json({ failed: true });
        })
        .catch(err => res.json(err));
}

exports.ApagarItem = (codbarra, obs, user, res) => {
    sqlserver.execSQLQuery(`insert into rastreio (nm_nome,cd_barra,ds_localidade_atual,ds_situacao,ds_obs,cd_usuario,dt_rastreio)
                            select 
                            nm_nome 
                            ,'${codbarra}'
                            ,loc.ds_descricao
                            ,'Item excluído por ${user}'
                            ,'${obs}'
                            ,(select cd_usuario from usuario where ds_login = '${user}')
                            ,getdate()
                            from
                            item obj join LOCALIDADE loc
                            on obj.cd_localidade_atual = loc.cd_localidade
                            where obj.cd_barra = '${codbarra}'
                            delete item where cd_barra = '${codbarra}'`, res)
}

exports.criaUsuario = (nome, login, senha, isAdmin, local, res) => {
    sqlserver.execSQLQuery('insert into usuario (nm_nome,ds_login,ds_senha,isAdmin,cd_localidade)'
        + `values ('${nome}','${login}',CONVERT(VARCHAR(32),HASHBYTES('MD5','${senha}'),2),${isAdmin},${local})`,res)
}