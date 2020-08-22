const express = require('express');
const app = express();
// Importamos el usuario
app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));

module.exports = app;