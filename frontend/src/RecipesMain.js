import React, { useState, useEffect } from "react";
import AddNewRecipe from "./AddNewRecipe";
import "./App.css"; 
import logo1951 from "./logo1951.png";
import plusiconinverted from "./plusiconinverted.png"; // Import the inverted plus icon

const HomePage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("Hot Drinks");
  const [recipes, setRecipes] = useState([]);

  const tabs = ["Hot Drinks", "Iced Drinks"];

  // Fetch recipes from the API
  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch(`http://127.0.0.1:5000/api/recipes?tags=${encodeURIComponent(activeTab)}`);
      const data = await response.json();
      console.log("Fetched recipes:", data); // Debugging line to verify the data
      setRecipes(data); // Update the state with the fetched recipes
    };

    fetchRecipes();
  }, [activeTab]);

  // Filter recipes by active tab
  const filteredRecipes = recipes.filter(
    (recipe) => recipe.tags === activeTab
  );

  return (
    <div className="tabbed-interface">
      <div className="top-bar">
        <div className="left-header">
          <img src={logo1951} alt="1951 Coffee Company Logo" className="logo" />
          <div className="tabs">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? "active" : ""}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="right-buttons">
          <button className="black-btn">
            Add New Ingredient
            <img src={plusiconinverted} alt="Add Ingredient" style={{ width: "20px", marginLeft: "10px", transform: "translateY(-2px)"}} />
          </button>
          <button className="black-btn" onClick={() => setShowPopup(true)}>
            Add New Recipe
            <img src={plusiconinverted} alt="Add Recipe" style={{ width: "20px", marginLeft: "10px", transform: "translateY(-2px)"}} />
          </button>
        </div>
      </div>

      <div className="tab-content">
        <h2>{activeTab}</h2>

        <div className="card-container">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <div key={recipe._id} className="recipe-card">
                <h3 className="recipe-title">{recipe.title}</h3> {/* Displaying only the title */}
                
                <div className="recipe-ingredients">
                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    recipe.ingredients.map((ingredient, index) => (
                      <span key={index}>
                        {ingredient.quantity} {ingredient.unit} {
                          (ingredient.category.toLowerCase() !== 'syrups' && ingredient.category.toLowerCase() !== 'bottled drinks') 
                          ? ingredient.type.toLowerCase() 
                          : ingredient.type
                        }
                        {ingredient.category.toLowerCase() === 'syrups' && ' syrup'}
                        {index < recipe.ingredients.length - 1 && ", "}
                      </span>
                    ))
                  ) : (
                    <span>No ingredients added yet</span>
                  )}
                </div>

                <div className="recipe-actions">
                  <button className="action-btn">View</button>
                  <button className="action-btn">Edit</button>
                  <button className="action-btn">Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>No recipes found for {activeTab}</p>
          )}
        </div>
      </div>

      <AddNewRecipe visible={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
};

export default HomePage;