const express = require('express');
const app = express();
// Importamos el usuario
app.use(require('./usuario'));
app.use(require('./categoria'));
app.use(require('./login'));
app.use(require('./producto'));

module.exports = app;