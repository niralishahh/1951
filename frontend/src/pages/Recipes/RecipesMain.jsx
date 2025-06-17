import React, { useState } from 'react';

function RecipesMain() {
  const [recipes, setRecipes] = useState([
    {
      id: 1,
      name: 'Spaghetti Carbonara',
      ingredients: ['Pasta', 'Eggs', 'Bacon', 'Parmesan'],
      prepTime: '20 min',
      difficulty: 'Medium'
    },
    {
      id: 2,
      name: 'Chicken Stir Fry',
      ingredients: ['Chicken', 'Vegetables', 'Soy Sauce', 'Rice'],
      prepTime: '25 min',
      difficulty: 'Easy'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recipe Management</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Add New Recipe
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{recipe.name}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Prep Time:</span> {recipe.prepTime}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Difficulty:</span> {recipe.difficulty}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Ingredients:</p>
                  <div className="flex flex-wrap gap-1">
                    {recipe.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors">
                    Edit
                  </button>
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecipesMain; 