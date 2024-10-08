const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    ingredients: { type: String, required: true },
    procedure: { type: String, required: true },
    servings: { type: Number, required: true },
    visibility: { type: String, default: 'public' },
    createdAt: { type: Date, default: Date.now }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
