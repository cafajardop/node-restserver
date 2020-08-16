//Siemrpe debe ir el express en conjunto con el app
const express = require('express');

// TODO metodo de encriptacion npm i bcrypt --save
const bcrypt = require('bcrypt');

// TODO JWT
const jwt = require('jsonwebtoken');

// TODO Segundo paso google sing-in
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);



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
            { expiresIn: process.env.CADUCIDAD_TOKEN }) /*Token expira en 30 dias si solo quiero una hora es 60 * 60 */


        res.json({
            ok: true,
            usuario: usuarioDB,
            token /* Sirve asi pero puedo quitar la palabra token por que es el mismo nombre es decir token:token*/
        })
    });
});


/* TODO Instalar Json WebToken npm install jsonwebtoken --save*/
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            })
        })

    Usuario.findOne({email:googleUser.email}, (err, usuarioDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };


        if(usuarioDB){
            if(usuarioDB.google === false){
                return res.status(400).json({
                    ok: false,
                    err:{
                        message: 'Debe de usar su atenticaciónj normal'
                    }
                }); 
            }else{
                let token = jwt.sign({
                    usuario: usuarioDB
                },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        }else{
            // Si el usuario no existe en la base de datos
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB)=>{
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                };
                let token = jwt.sign({
                    usuario: usuarioDB
                },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            })
        }

    })

});

/* TODO Instalar google auto - npm install google-auth-library --save */
module.exports = app;