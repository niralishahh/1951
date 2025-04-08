const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  ingredients: Array,
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;

