const mongoose = require("mongoose");
const { Schema } = mongoose;

// Definición del esquema del usuario
const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"], // Validación de campo obligatorio
        minlength: [10, "El nombre no puede tener menos de 10 caracteres"] // Validación de longitud mínima
    },
    email: {
        type: String,
        required: [true, "El email es obligatorio"], // Validación de campo obligatorio
        unique: true, // Asegura que no haya duplicados de email en la base de datos
        match: [/.+@.+\..+/, "Por favor, ingresa un email válido"] // Validación de formato de email
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"], // Validación de campo obligatorio
        minlength: [6, "La contraseña debe tener al menos 6 caracteres"] // Validación de longitud mínima para la contraseña
    }
});

// Creación del modelo de usuario usando el esquema definido
const User = mongoose.model("User", UserSchema);

module.exports = {
    User
}
