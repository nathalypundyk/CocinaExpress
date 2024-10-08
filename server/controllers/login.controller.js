const {User} = require("../models/user"); // Importa el modelo de usuario desde el archivo correspondiente
const UserContent = require("../models/UserContent.model"); // Asegúrate de que la ruta sea correcta
const mongoose = require("mongoose"); // Importa mongoose para manejo de la base de datos
const bcrypt = require("bcrypt"); // Importa bcrypt para encriptar contraseñas
const jwt = require("jsonwebtoken"); // Importa jsonwebtoken para la creación de tokens JWT

const JWT_SECRET = "$h0laMwnd0"; // Define la clave secreta para firmar los tokens JWT

// Función de registro de usuario
const register = async (req, res) => {
    let userData = req.body; // Extrae los datos del cuerpo de la solicitud
    try {
        // Verifica si el usuario ya existe en la base de datos
        let existUser = await User.exists({ email: userData.email });
        if (existUser) {
            return res.status(500).json({ errors: { email: "El email ya existe" } });
        }

        // Genera un hash para la contraseña del usuario
        let hash = await new Promise((resolve, reject) => {
            bcrypt.hash(userData.password, 10, function (err, hash) {
                if (err) reject(err);
                resolve(hash);
            });
        });

        // Crea un nuevo usuario con la contraseña encriptada
        let user = new User({
            ...userData,
            password: hash
        });

        console.log("Usuario antes de guardar:", user); // Verificar usuario antes de guardar
        // Guarda el usuario en la base de datos
        await user.save();
        console.log("Usuario guardado en la base de datos:", user); // Verificar usuario después de guardar

        // Crear contenido adicional del usuario 
        let userContent = new UserContent({
            userId: user._id,
            name: user.name
        });
        console.log("Contenido de usuario antes de guardar:", userContent); // Verificar contenido de usuario antes de guardar

        try {
            await userContent.save();
            console.log('Contenido del usuario guardado:', userContent);
        } catch (error) {
            console.error('Error al guardar el contenido del usuario:', error);
            await User.findByIdAndDelete(user._id); 
            return res.status(500).json({ error: "Error al guardar el contenido del usuario." });
        }

        res.json({ user, userContent }); // Retorna el contenido del usuario

    } catch (error) {
        console.error('Error durante el registro:', error);
        if (error instanceof mongoose.Error.ValidationError) {
            let errors = {};
            Object.keys(error.errors).map((key) => {
                errors[key] = error.errors[key].message;
            });
            res.status(400).json({ errors: errors }); // Maneja errores de validación
        } else {
            res.status(500).json({ error: error.toString() }); // Maneja otros errores
        }
    }
};

// Función de inicio de sesión
const login = async (req, res) => {
    let data = req.body; // Extrae los datos del cuerpo de la solicitud
    try {
        let user = await User.findOne({email: data.email}); // Busca el usuario por email

        let samePassword = await bcrypt.compareSync(data.password, user.password); 
        // Compara la contraseña ingresada con la almacenada

        if (samePassword) {
            const payload = {
                id: user._id,
                name: user.name
            };

            // Genera un token de acceso con JWT
            let token = jwt.sign(payload, JWT_SECRET, {
                expiresIn: "1000d"
            });

            // Genera un token de refresco
            let refreshToken = jwt.sign(payload, JWT_SECRET, {
                expiresIn: "1000d"
            });

            // Configura una cookie con el token de acceso
            res.cookie("token", token, {
                httpOnly: true
            });

            // Retorna el usuario, token de acceso y de refresco
            res.json({
                user: payload,
                token,
                refreshToken
            });
        } else {
            res.status(400).json({error: "Usuario y contraseña equivocados"}); 
            // Retorna un error si las credenciales son incorrectas
        }
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Manejo de errores de validación (vacío en este caso)
        } else {
            res.status(500).json({error: error.toString()}); // Maneja otros errores
        }
    }
};

// Función para refrescar el token de acceso
const refresh = (req, res) => {
    let data = req.body; // Extrae los datos del cuerpo de la solicitud

    if (!data.refreshToken) {
        return res.json({error: "Refresh token no enviado"}); 
        // Retorna un error si no se envía el token de refresco
    }

    try {
        let payload = jwt.verify(data.refreshToken, JWT_SECRET); 
        // Verifica el token de refresco

        payload = {
            id: payload.id,
            name: payload.name
        };
        /*
        Aquí se pueden eliminar las propiedades `iat` (issued at) y `exp` (expiration) del payload si se desea.
        */

        // Genera un nuevo token de acceso y un nuevo token de refresco
        let token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: "30d"
        });
        let refreshToken = jwt.sign(payload, JWT_SECRET, {
            expiresIn: "1000d"
        });

        // Retorna los nuevos tokens
        res.json({
            token,
            refreshToken
        });
    } catch (error) {
        return res.json({error: error.toString()}); // Maneja errores durante la verificación
    }
};

module.exports = {
    register,
    login,
    refresh
};
// Exporta las funciones para que puedan ser utilizadas en otros archivos
