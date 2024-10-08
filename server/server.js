// server.js

// Importa las dependencias necesarias
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require("./config/mongoose.config");

const app = express();

// Configura middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

// Importa las rutas existentes
const { oAuthRouter } = require("./routes/oauth.routes");
const userContentRouter = require("./routes/UserContent.routes");
const postrouter = require("./routes/Post.routes");

// Importa la nueva ruta de recetas
const recipeRouter = require('./routes/Home.routes');
const profileRoutes = require('./routes/user.routes');
// Configura las rutas
app.use("/api/profile", recipeRouter);
app.use("/", postrouter);
app.use("/", oAuthRouter);
app.use("/user", userContentRouter);
//app.use("/api/recipes", recipeRouter);
app.use("/user", profileRoutes); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configura la ruta estática para servir archivos de la carpeta 'uploads'
app.use("/api/static", express.static(path.join(__dirname, 'uploads')));

// Inicia el servidor y escucha en el puerto 5000
app.listen(5000, () => {
    console.log("Éxito: app escuchando en puerto 5000");
});
