const mongoose = require('mongoose');
//  TODO Validar llaves duplicadas mongoose-unique-validator npm i mongoose-unique-validator  => sirve para cuando retorne una llave duplicada retornar un mejor valor
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos={
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;
let usuarioSchema = new Schema({
    nombre: {
        type:String,
        required: [true,'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario'] /* Llave duplicada se aplica el uniquevalidator */
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'] 
    },
    img: {
        type: String,
        required: false
    }, /* La imagen no es obligatoria */
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos //TODO Enum validacion campos para validar el role se debe hacer atraves de una enumeracion
    },
    estado: {
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
});

// lo que hacemos es modificar el objeto para que no nos devuelva el campo password
usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

// TODO Este plugin es para el unique validator del correo electronico y deja la misma estructura de cuando mandamos otro tipo de archivo
usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser único'});
module.exports = mongoose.model('Usuario', usuarioSchema);