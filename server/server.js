require('./config/config');

const express = require('express');
// Conectarme a mongose hacemos la instalacion npm install mongoose --save
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Importamos el usuario
app.use(require('./routes/usuario'));

// Conectarnos a la base de datos mongoose
mongoose.connect( process.env.URLDB,
                { useNewUrlParser: true, useCreateIndex: true},/*  Configuraciones para conectarme a mi base de datos externa */
                (err, res) =>{
    //Si recibo un error hago un throw err
    if ( err ) throw err;

    //Caso contrario Base de datos online
    console.log('Base de datos ONLINE');
})


// Escuchando el puerto de express y la variable la colocamos despues del listen que se encuentra en la carpeta config.js
// comando arranque =>  nodemon server/server
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});


///Git heroku master
/* git add .
git commit -m "message"
git push heroku master */

// TODO Actualizar npm => npm update  => Desistalar paquetes npm uninstall bcrypt




