const Recipe = require('../models/Home.model');

const getPopularRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().sort({ _id: -1 }).limit(3);
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener recetas populares' });
    }
};

module.exports = { getPopularRecipes };
