const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//  TODO Validar llaves duplicadas mongoose-unique-validator npm i mongoose-unique-validator  => sirve para cuando retorne una llave duplicada retornar un mejor valor
const uniqueValidator = require('mongoose-unique-validator');

let categoriaSchema = new Schema({
    descripcion: { type: String, unique: true, required: [true, 'La descripción es obligatoria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

// TODO Este plugin es para el unique validator del correo electronico y deja la misma estructura de cuando mandamos otro tipo de archivo
/* categoriaSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser único'}); */

module.exports = mongoose.model('Categoria', categoriaSchema);