// Importamos los modelos necesarios para interactuar con la base de datos
const User = require('../models/user');
const UserContent = require('../models/UserContent.model');

// Controlador para obtener un usuario por su ID
const getUserById = async (req, res) => {
    try {
        // Obtenemos el ID del usuario desde los parámetros de la solicitud
        const userId = req.params.userId;

        // Buscamos el usuario en la base de datos usando el ID
        const user = await User.findById(userId);
        if (!user) {
            // Si el usuario no se encuentra, respondemos con un estado 404 y un mensaje
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Buscamos el contenido asociado al usuario usando el ID del usuario
        const userContent = await UserContent.findOne({ userId });

        // Respondemos con los detalles del usuario y su contenido
        res.json({
            name: user.name,
            email: user.email,
            bio: userContent.bio,
            profileImage: userContent.profileImage,
            recipes: userContent.recipes
        });
    } catch (err) {
        // En caso de error, respondemos con un estado 500 y el mensaje de error
        res.status(500).json({ message: err.message });
    }
};

// Controlador para actualizar el perfil del usuario
const updateUser = async (req, res) => {
    try {
        // Obtenemos el ID del usuario desde los parámetros de la solicitud
        const userId = req.params.id;
        // Obtenemos los datos del perfil desde el cuerpo de la solicitud
        const { name, bio } = req.body;
        // Obtenemos la imagen de perfil si está presente en los archivos de la solicitud
        const profileImage = req.files ? req.files.profileImage : null;

        // Buscamos el usuario en la base de datos usando el ID
        const user = await User.findById(userId);
        if (!user) {
            // Si el usuario no se encuentra, respondemos con un estado 404 y un mensaje
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Actualizamos el nombre del usuario si se proporciona uno nuevo
        user.name = name || user.name;
        // Guardamos los cambios en el usuario
        await user.save();

        // Buscamos el contenido asociado al usuario usando el ID del usuario
        const userContent = await UserContent.findOne({ userId });
        if (!userContent) {
            // Si el contenido del usuario no se encuentra, respondemos con un estado 404 y un mensaje
            return res.status(404).json({ message: "Contenido del usuario no encontrado" });
        }

        // Actualizamos la biografía del usuario si se proporciona una nueva
        userContent.bio = bio || userContent.bio;
        // Si se proporciona una nueva imagen de perfil, actualizamos la URL de la imagen
        if (profileImage) {
            userContent.profileImage = `/static/${profileImage.name}`;
            // Aquí se debería guardar la imagen en el servidor o en un servicio de almacenamiento
        }
        // Guardamos los cambios en el contenido del usuario
        await userContent.save();

        // Respondemos con un mensaje de éxito
        res.json({ message: "Perfil actualizado exitosamente" });
    } catch (err) {
        // En caso de error, respondemos con un estado 500 y el mensaje de error
        res.status(500).json({ message: err.message });
    }
};

//PARA CERRAR SESION

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.status(200).send('Sesión cerrada exitosamente');
    });
};

// Exportamos los controladores para que puedan ser utilizados en otras partes de la aplicación
module.exports = {
    getUserById,
    updateUser
};
