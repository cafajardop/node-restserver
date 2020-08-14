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
process.env.CADUCIDAD_TOKEN= 60 * 60 * 24 * 30;

// ============================
//  Semilla de autenticacion SEED
// ============================
process.env.SEED = process.env.SEED|| 'este-es-el-seed-desarrollo'
// ============================
//  Base de datos
// ============================
let urlDB;
if( process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
}else { 
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


/* TODO COMO CREAR UNA VARIABLE DE ENTORNO */
// SI QUIERO LISTARLAS => heroku config
// DECLARAR OTRA => heroku config:set SEED="este-es-el-seed-produccion"
