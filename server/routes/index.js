const express = require('express');
const app = express();
// Importamos el usuario
app.use(require('./usuario'));
app.use(require('./login'));

module.exports = app;