// Importamos el módulo express para crear el enrutador
const express = require("express");
// Creamos una instancia del enrutador
const router = express.Router();

// Importamos las funciones del controlador que manejarán las rutas
const { getUserById, updateUser } = require("../controllers/user.controller");

// Ruta para obtener un usuario por su ID
// El parámetro ':id' es dinámico y se usa para capturar el ID del usuario en la URL
// La función getUserById se encarga de procesar la solicitud y devolver la información del usuario
router.get("/user/:id", getUserById);

// Ruta para actualizar el perfil del usuario
// Utilizamos el método PUT para actualizar recursos existentes
// La función updateUser maneja la solicitud de actualización del perfil
router.put('/profile/update', updateUser);

// Ruta para cerrar sesión
// router.post('/logout', userController.logout);

// Exportamos el enrutador para que pueda ser utilizado en otras partes de la aplicación
module.exports = router;
