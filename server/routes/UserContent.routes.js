const express = require("express");
const userController = require("../controllers/UserContent.controller");
const { verifyToken } = require("../utils/oauth");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); // Directorio donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Nombre único para cada archivo
    }
});

const upload = multer({ storage: storage });

// Ruta para actualizar el perfil de usuario
router.put("/profile/update/:userId", verifyToken, upload.single('profileImage'), userController.updateUserProfile);

module.exports = router;
