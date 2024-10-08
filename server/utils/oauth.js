const jwt = require("jsonwebtoken"); // Importa la biblioteca jsonwebtoken para trabajar con JWT
const JWT_SECRET = "$h0laMwnd0"; // Secreto utilizado para firmar y verificar los tokens

// Middleware para verificar el token de autenticación
const verifyToken = (req, res, next) => {
    // Intenta obtener el token del encabezado "Authorization" en el formato "Bearer <token>"
    const header = req.header("Authorization") || ""; 
    let token = header.split(" ")[1]; // Extrae el token después del espacio en blanco

    // Si el token no se encuentra en el encabezado, verifica si está en las cookies
    if (!token && req.cookies) {
        token = req.cookies.token; // Usa el token almacenado en las cookies si está presente
    }

    // Si no se encontró ningún token, devuelve un error 401 (No autorizado)
    if (!token) {
        return res.status(401).json({ error: "Token no enviado" });
    }

    try {
        // Verifica el token usando el secreto JWT
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload; // Guarda el payload del token en el objeto req para su uso posterior
        console.log("VERIFYTOKEN:", payload); // Imprime el payload del token para depuración
        next(); // Llama al siguiente middleware o ruta en la cadena de procesamiento
    } catch (error) {
        // Si ocurre un error durante la verificación, devuelve un error 401 (No autorizado)
        return res.status(401).json({ error: error.toString() });
    }
};

module.exports = {
    verifyToken // Exporta el middleware para usarlo en otras partes de la aplicación
};
