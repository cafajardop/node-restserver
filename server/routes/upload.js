/* TODO Ejecutamos el comando npm i --save express-fileupload */
/* TODO Creamos la carpeta uploads  */
const express = require('express');
const fileUpload = require('express-fileupload');
const { json } = require('body-parser');
const app = express();

/* TODO Debemos importar el file system para el borrado de la carpeta tambien es necesario el path*/
const fs = require('fs');
const path = require('path');


const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function (req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    // Validar tipo 
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las tipos permitidas son ' + tiposValidos.join(', ')
            }
        })
    }


    let archivo = req.files.archivo; /* Este nombre va en Body form-data archivo */
    let splitArchivo = archivo.name.split('.');
    let extension = splitArchivo[splitArchivo.length - 1]

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                extension
            }
        });
    }

    // Cambiar el nombre del archivo
    // 2123132132-123.jpg
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    // En este punto la imagen ya se subio y si pone usuarios cae en usuario si pone productos cae en productos
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        // Aqui la imagen se cargo
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios')
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        //Verificar la ruta del archivo exista y si existe la borra como parametro se le envia el id de la imagen
        borrarArchivo(usuarioDB.img, 'usuarios')

        // El usuario existe
        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        })

    });
}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos')
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no existe'
                }
            });
        }

        //Verificar la ruta del archivo exista y si existe la borra como parametro se le envia el id de la imagen
        borrarArchivo(productoDB.img, 'productos')

        // El producto existe
        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        })

    });

}

function borrarArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;