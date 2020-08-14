//Siemrpe debe ir el express en conjunto con el app
const express = require('express');
// TODO metodo de encriptacion npm i bcrypt --save
const bcrypt = require('bcrypt');
// TODO JWT
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario'); /* Importamos el usuario */
const app = express(); /* Para que funcione en el server debo hacerle un export */

app.post('/login', (req, res) => {

    let body = req.body;
    /* Metodo para regresar solo uno findOne */
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        /* Validamos si el usuario tiene la constraseña correcta */
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrecta'
                }
            });
        }

        /* Desencriptamos la contraseña */
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrecta'
                }
            });
        }

        
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, /* Se configura en el config y se deja como variable por que es mi llave secreta */
        { expiresIn: process.env.CADUCIDAD_TOKEN}) /*Token expira en 30 dias si solo quiero una hora es 60 * 60 */


        res.json({
            ok: true,
            usuario: usuarioDB,
            token /* Sirve asi pero puedo quitar la palabra token por que es el mismo nombre es decir token:token*/
        })
    });
});

/* TODO Instalar Json WebToken npm install jsonwebtoken --save*/

module.exports = app;