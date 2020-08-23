
const jwt = require('jsonwebtoken')
/* Creamos una funcion que ejecute algo en particular y para eso ejecutaremos el la funcion del token */
// ======================
// Verificar Token
// ======================
/* Funcion de flecha y recibe 3 argumentos el next continua con la ejecucion del programa   */
let verificaToken = (req,res,next) =>{

    // Ahora debemos leer el Header donde viene el token
    let token = req.get('token'); /* si en vez de token usamos Autorization deberiamos de pasar este parametro Autorization tal cual... */
    
    // aqui podemos llamar el token pero para eso sirve la funcion next para que haga la validacion correcta
    /* res.json({
        token: token
    }) */

    /* Ahora debemos identificar si el token es válido importamos la libreria jwt = require('jsonwebtoken')*/
    jwt.verify(token, process.env.SEED,(err, decoded)=>{/* Pide 3 cosas el token luego el SEED y un callback decode */

        /* Si no es valido llamamos el codigo 401 que Inautorize = sin autorizacion */
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        /* Si pasa obtenemos la informacion del decoded */
        req.usuario = decoded.usuario; /* Dentro del objeto viene el usuario por eso lo colocamos */
        next(); /* Llamamos en el next dentro de la verificaToken por que si se hace por fuera siempre va a pasar */

    }); 


    /* console.log(token); */

};

// =====================
// Verifica AdminRole
// =====================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};

// ==========================
// Verifica token para imagen
// ==========================
let verificaTokenImg = (req, res, next)=>{

    let token = req.query.token;
    jwt.verify(token, process.env.SEED,(err, decoded)=>{/* Pide 3 cosas el token luego el SEED y un callback decode */
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        req.usuario = decoded.usuario; /* Dentro del objeto viene el usuario por eso lo colocamos */
        next(); /* Llamamos en el next dentro de la verificaToken por que si se hace por fuera siempre va a pasar */
    });
}

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}