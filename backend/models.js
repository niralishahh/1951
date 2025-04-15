const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  ingredients: {
    category: String,
    // rename 'type' to avoid confusion with Mongoose's 'type'
    ingredientName: String,
    quantity: Number,
  },
  tags: String,
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
