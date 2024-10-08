const { UserContent } = require('../models/UserContent.model.js'); // Importa el modelo UserContent
const jwt = require("jsonwebtoken"); // Importa JWT para manejo de tokens
const JWT_SECRET = "$h0laMwnd0"; // Llave secreta para JWT
const { verifyToken } = require("../utils/oauth.js"); // Importa el middleware para verificar tokens

// Controlador para obtener el perfil del usuario que ha iniciado sesión
exports.getUserProfile = async (req, res) => {
    try {
        // Obtiene el ID del usuario a partir del token verificado en el middleware
        const id = req.user.id;
        console.log("USERCONTROLLER, ID:", id);

        // Busca el contenido del usuario en la base de datos usando el ID
        const userContent = await UserContent.findOne({ userId: id });

        if (!userContent) {
            // Si no se encuentra el perfil, retorna un error 404
            return res.status(404).json({ error: "Perfil de usuario no encontrado" });
        }

        // Si se encuentra el perfil, lo envía como respuesta en formato JSON
        res.json(userContent);
    } catch (error) {
        // Manejo de errores, retornando un mensaje con el error capturado
        return res.status(500).json({ error: error.toString() });
    }
};

// Controlador para obtener el perfil de cualquier usuario por su ID
exports.getUserById = async (req, res) => {
    try {
        // Obtiene el ID del usuario desde los parámetros de la URL
        const userId = req.params.userId;
        // Busca el contenido del usuario en la base de datos usando el ID
        const user = await UserContent.findOne({ userId: userId });

        if (!user) {
            // Si no se encuentra el perfil, retorna un error 404
            return res.status(404).json({ error: "Perfil de usuario no encontrado" });
        }

        // Si se encuentra el perfil, lo envía como respuesta en formato JSON
        res.json(user);
    } catch (error) {
        // Manejo de errores, retornando un mensaje con el error capturado
        return res.status(500).json({ error: error.toString() });
    }
};

// Controlador para actualizar el perfil del usuario que ha iniciado sesión
exports.updateUserProfile = async (req, res) => {
    console.log("DENTRO DE UPDATEUSER");
    try {
        // Extrae los datos del cuerpo de la solicitud
        const { userId, name, bio } = req.body;
        const profileImage = req.file ? req.file.filename : null; // Verifica si se ha subido una imagen de perfil
        console.log(profileImage);

        const updateData = { userId, name, bio }; // Crea un objeto con los datos a actualizar
        if (profileImage) {
            // Si se subió una imagen, se añade a los datos a actualizar con la URL correspondiente
            updateData.profileImage = `http://localhost:5000/api/static/${profileImage}`;
        }

        // Realiza la actualización del perfil en la base de datos usando el ID del usuario
        const updatedUser = await UserContent.findOneAndUpdate(
            { userId: req.user.id }, // Usando req.user.id como identificador del usuario
            updateData,
            { new: true } // Retorna el documento actualizado
        );

        console.log("updated user", updatedUser);
        if (!updatedUser) {
            // Si no se encuentra el usuario, retorna un error 404
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        console.log("Usuario encontrado");

        // Si se actualiza el perfil, envía una respuesta con un mensaje de éxito y el perfil actualizado
        res.status(200).json({ message: 'Perfil actualizado con éxito', user: updatedUser });
    } catch (error) {
        console.error(error);
        // Manejo de errores, retornando un mensaje con el error capturado
        res.status(500).json({ message: '(controlador) Error al actualizar el perfil' });
    }
};
