import React, { useState, useEffect } from 'react';

const RecipeViewer = ({ recipeId }) => {
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/recipes/${recipeId}`);
                if (!response.ok) throw new Error('Recipe not found');
                const data = await response.json();
                setRecipe(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        if (recipeId) fetchRecipe();
    }, [recipeId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!recipe) return <p>No recipe found</p>;

    return (
        <div>
            <h1>{recipe.title}</h1>
            <p>{recipe.description}</p>
            {/* Display other recipe details */}
        </div>
    );
};

export default RecipeViewer;
