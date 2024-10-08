// routes/recipeRoutes.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Home.model'); // Asegúrate de tener el modelo Post importado

// Define la ruta para obtener todas las recetas
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find(); // O el método que estés usando para obtener recetas
        res.json({ posts }); // Asegúrate de devolver un objeto con la propiedad `posts`
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener recetas' });
    }
});

module.exports = router;
