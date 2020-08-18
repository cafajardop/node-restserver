require('./config/config');

const express = require('express');
// Conectarme a mongose hacemos la instalacion npm install mongoose --save
const mongoose = require('mongoose');
// Para leer el index y la carpta publica es un paquete de node por defecto
const path = require('path');

const app = express();

const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// Configuracion Global de rutas
app.use(require('./routes/index'));

// Habilitar la carpeta public Index para que pueda ser accedida 
app.use(express.static(path.resolve(__dirname, '../public'))) //TODO Importar el path en la parte de arriba const path = require('path');


// Conectarnos a la base de datos mongoose
mongoose.connect(process.env.URLDB,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },/*  Configuraciones para conectarme a mi base de datos externa */
    (err, res) => {
        //Si recibo un error hago un throw err
        if (err) throw err;

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


// Ocultar la contraseña expuesta en github y heroku ejecutamos el comando => heroku config
// heroku config: set MONGO_URI => ME CREA UNA VARIABLE DE ENTORNO Y LA OCULTA 
// heroku config: unset <variable> => me borra la variable por si me equivoco
// heroku config: set MONGO_URI = "Pego la variable de entorno de produccion para que no se vea la clave debe ser toda la url llamada urlDB"



