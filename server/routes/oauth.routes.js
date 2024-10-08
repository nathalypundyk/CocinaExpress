const express = require("express");
const { register, login, refresh } = require("../controllers/login.controller");
const router = express.Router();

// Ruta para el registro de usuarios
router.post("/register/", register);

// Ruta para el inicio de sesión de usuarios
router.post("/login/", login);

// Ruta para refrescar el token JWT
router.post("/refresh/", refresh);

// Exportación del enrutador
module.exports = {
    oAuthRouter: router
}
