//Siemrpe debe ir el express en conjunto con el app
const express = require('express');
// TODO metodo de encriptacion npm i bcrypt --save
const bcrypt = require('bcrypt');
//filtrar campos para poder hacer la actualización
const _ = require('underscore')

const app = express(); /* Para que funcione en el server debo hacerle un export */
const Usuario = require('../models/usuario'); /* Importamos el usuario */

//Importamos el middleware 
const { verificaToken, verificaAdmin_Role } = require('../middleware/autenticacion');

/* app.get('/usuario', function (req, res) {  => COMO ESTABA ANTES SIN EL MIDDLEWARE*/
app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0; /* Puede llegar la pagina desde si no viene supondre que sera la pagina 0 cero */
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    // Buscar usuarios
    Usuario.find({ estado: true }, 'nombre email role estado google img') /* Puedo especificar que campos quiero mostrar excluir */
        .skip(desde) /* Salta los registros y obtiene de 5 en 5 es para paginacion */
        .limit(limite) /* Obtengo solo 5 registros */
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            /* Podemos contar registros con la funcion count */
            Usuario.countDocuments({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    total: conteo
                });
            });

        })

});

app.post('/usuario', [verificaToken,verificaAdmin_Role] ,(req, res)=> {
    let body = req.body;

    // Instanciamos el usuario
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    // Grabar en la base de datos  ====> usuarioDB ES EL USUARIO DE LA BASE DE DATOS
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // No debemos retornar la contraseña por lo cual retornamos el null a pesar de que ya quedo grabada -- esta es una manera pero no es bueno retornar nada
        /* usuarioDB.password = null; */

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
});

app.put('/usuario/:id', [verificaToken,verificaAdmin_Role], (req, res)=> {
    let id = req.params.id;

    //TODO quitar elementos del body con underscore https://underscorejs.org/ sirve para pick ya que regresa una copia del objeto filtrando
    //los valores que quiero mostrar  npm install underscore --save se  declara despues del bcrypt const _= require('underscore')
    /* Solo filtro lo que quiero actualizar */
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })

});

app.delete('/usuario/:id', [verificaToken,verificaAdmin_Role], (req, res)=> {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    /* Este metodo borra por completo un registro de la base de datos pero no es buena practica por lo cual solo actualizo el estado de true a false */
    /* Usuario.findByIdAndRemove(id,(err, usuarioBorrado)=>{
        
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        };

        if(!usuarioBorrado){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    }) */


    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;