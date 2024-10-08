const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserContentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo `User` para establecer la relación
        required: true
    },
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"], // Validación de campo obligatorio
        minlength: [10, "El nombre no puede tener menos de 10 caracteres"] // Validación de longitud mínima
    },
    profileImage: {
        type: String, // Almacena la ruta de la imagen de perfil
        default: "/default-avatar.jpg" // Imagen por defecto si el usuario no carga una
    }, 
    bio: {
        type: String,
        default: "Hi!" // Biografía por defecto
    }
});

// Creación del modelo `UserContent` usando el esquema definido
const UserContent = mongoose.model("UserContent", UserContentSchema);

// Exportación del modelo para su uso en otras partes de la aplicación
module.exports = UserContent;
