// ============================
//  dotenv
// ============================
const NODE_ENV = process.env.NODE_ENV || 'develpment';
require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`
});

// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
//  Entorno 
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  Vencimiento de token
// ============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = '48h';

// ============================
//  Semilla de autenticacion SEED
// ============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'
// ============================
//  Base de datos
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = "mongodb+srv://cafajardop:CafaJEMAGLmZTqSLdVLK@cluster0.5uvrt.mongodb.net/cafe"
    /* process.env.MONGO_URI; */
    /* heroku config:set MONGO_URI="mongodb+srv://cafajardop:CafaJEMAGLmZTqSLdVLK@cluster0.5uvrt.mongodb.net/cafe"*/
}
process.env.URLDB = urlDB;

// ============================
//  TODO Tercer paso GOOGLE CLIEN SING-IN GOOGLE
// ============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '341949644300-3r0og20a8703omkemgf3u38hibqaieu2.apps.googleusercontent.com'


/* TODO COMO CREAR UNA VARIABLE DE ENTORNO */
/* TODO LISTAR CONFIGURACIONES
    heroku config */

/* TODO SEED */
/* heroku config:set SEED="este-es-el-seed-produccion" */

/* TODO MONGO_URI Recordad que al final de la cadena de conexion se puede actualizar el nombre de la base de datos en este caso cafe*/
/* heroku config:set MONGO_URI="mongodb+srv://cafajardop:CafaJEMAGLmZTqSLdVLK@cluster0.5uvrt.mongodb.net/cafe"*/

/* TODO Base de datos nube https://cloud.mongodb.com/v2/5f2f456bb376c36b72de7441#metrics/replicaSet/5f2f46932f093e6eb3ebb72e/explorer/cafe/categorias/find */

/* TODO BORRAR HEROKU CONFIG */
/* heroku config:unset MONGO_URI */