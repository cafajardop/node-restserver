// Siempre va el express
const express = require('express');
let app = express();

let Categoria = require('../models/categoria');

// Importar el middleware
const { verificaToken, verificaAdmin_Role } = require('../middleware/autenticacion');

/* Mostrar todas las categorias */
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')                /* => Sirve para ordenar  */
        .populate('usuario','nombre email') /* => sirve para revisar que objetos hay en otras tablas en este caso me trae 
                                                todo lo de usuario solo colocandolo entre comillas simples  como segundo 
                                                argumento le puedo enviar los campos que necesito 
                                                si quiero otro esquema duplico el populate y hago lo mismo*/
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            /* Conteo categoria */
            Categoria.count((err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    total: conteo
                });
            });
        });
});

/* Mostrar una categoria por ID */
app.get('/categoria/:id', verificaToken, (req, res) => {
    /* Categoria.findById */
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });

});

/* Crear nueva categoria */
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    // Instanciamos el objeto
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id /* Se envia el usuario desde el req. para que verifique el token */
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        /* Si categoriaDB no creo nos arroja un error 400 */
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

/* Crear nueva categoria */
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        /* Si categoriaDB no creo nos arroja un error 400 */
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

/* Crear nueva categoria */
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    /* Este metodo borra por completo un registro de la base de datos pero no es buena practica por lo cual solo actualizo el estado de true a false */
    Categoria.findByIdAndRemove(id, (err, categoriaBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!categoriaBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        });
    })
});

module.exports = app;