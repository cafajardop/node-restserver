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
process.env.CADUCIDAD_TOKEN= '48h';

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

// ============================
//  TODO Tercer paso GOOGLE CLIEN SING-IN GOOGLE
// ============================
process.env.CLIENT_ID = process.env.CLIENT_ID ||'341949644300-3r0og20a8703omkemgf3u38hibqaieu2.apps.googleusercontent.com'  


/* TODO COMO CREAR UNA VARIABLE DE ENTORNO */
// SI QUIERO LISTARLAS => heroku config
// DECLARAR OTRA => heroku config:set SEED="este-es-el-seed-produccion"
