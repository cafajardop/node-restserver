const express = require('express');
let app = express();

// Importar el middleware
const { verificaToken } = require('../middleware/autenticacion');
const Producto = require('../models/producto');

/* Mostrar todas las productos */
app.get('/producto', verificaToken, (req, res) => {

    /* Paginacion */
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    
    Producto.find({disponible: true}, 'nombre precioUni')
        .sort('nombre')
        .skip(desde)
        .limit(limite)        
        .populate('usuario','nombre email') /* => sirve para revisar que objetos hay en otras tablas en este caso me trae 
                                                todo lo de usuario solo colocandolo entre comillas simples  como segundo 
                                                argumento le puedo enviar los campos que necesito 
                                                si quiero otro esquema duplico el populate y hago lo mismo*/
        .populate('categoria','descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            /* Conteo categoria */
            Producto.count((err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    total: conteo
                });
            });
        });
});

/* Mostrar una Producto por ID */
app.get('/producto/:id', verificaToken, (req, res) => {
    /* Producto.findById */
    let id = req.params.id;

    /* El metodo findbyid sirve para buscar por id de producto */
    Producto.findById(id, (err, productoDB) => {
        
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    });

});

/* Crear nueva producto */
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;
    
    // Instanciamos el objeto
    let producto = new Producto({
        usuario: req.usuario._id, /* Se envia el usuario desde el req. para que verifique el token */
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        /* Si productoDB no creo nos arroja un error 400 */
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

/* Crear nuevo producto */
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descProducto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        disponible: body.disponible
    };

    Producto.findByIdAndUpdate(id, descProducto, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        /* Si productoDB no creo nos arroja un error 400 */
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });

});

/* Crear nueva producto */
app.delete('/producto/:id', [verificaToken], (req, res) => {
    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, ProductoBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            message: 'Producto Borrado'
        });
    });
});

module.exports = app;