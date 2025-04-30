import React, { useState, useEffect } from "react";
import { Nav, Button } from 'react-bootstrap';
import AddNewRecipe from "./AddNewRecipe";
import "./App.css";
import { Link, NavLink } from "react-router-dom";
import logo1951 from "./logo1951.png";
import plusiconinverted from "./plusiconinverted.png";

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
      console.log("Fetched recipes:", data);
      setRecipes(data);
    };
    fetchRecipes();
  }, [activeTab]);

  // Filter recipes based on the active tab
  const filteredRecipes = recipes.filter(
    (recipe) => recipe.tags === activeTab
  );

  return (
    <div>
      {/* === NAVBAR AREA (Should be working as intended now) === */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #dee2e6"
      }}>
        <img src={logo1951} alt="1951 Coffee Company Logo" style={{ height: "50px", width: "auto" }} />
        <Nav>
          <Nav.Item>
            <NavLink to="/Home.js" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Home</NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink to="/Inventory" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Inventory</NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink to="/RecipesMain.js" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Recipe</NavLink>
          </Nav.Item>
        </Nav>
      </div>
      {/* === END OF NAVBAR AREA === */}


      {/* === REMOVED the separate div for Add buttons === */}
      {/* The buttons are now moved into the div below */}


      {/* === ROW FOR TABS/TITLE and ADD BUTTONS === */}
      {/* This div now uses flexbox to align items horizontally */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between', // Pushes items to opposite ends
        alignItems: 'center',           // Vertically aligns items in the middle
        padding: "10px 20px",           // Keeps padding consistent
        borderBottom: "1px solid #dee2e6" // Keeps border consistent
      }}>
        {/* Left side: Tab Buttons (or you could put <h2>{activeTab}</h2> here instead) */}
        <div>
          {tabs.map(tab => (
            <Button
              key={tab}
              variant={activeTab === tab ? "primary" : "outline-secondary"}
              onClick={() => setActiveTab(tab)}
              style={{ marginRight: '10px' }}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Right side: Add Buttons are moved here */}
        <div>
          <button className="black-btn" style={{ marginRight: '10px' }}>
            Add New Ingredient
            <img src={plusiconinverted} alt="Add Ingredient" style={{ width: "20px", marginLeft: "10px", verticalAlign: "middle" }} />
          </button>
          <button className="black-btn" onClick={() => setShowPopup(true)}>
            Add New Recipe
            <img src={plusiconinverted} alt="Add Recipe" style={{ width: "20px", marginLeft: "10px", verticalAlign: "middle" }} />
          </button>
        </div>
      </div>
      {/* === END OF ROW FOR TABS/TITLE and ADD BUTTONS === */}


      {/* === CONTENT AREA (Recipe Cards) === */}
      <div className="tab-content" style={{ padding: "20px" }}>
        <div className="card-container">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <div key={recipe._id} className="recipe-card">
                <h3 className="recipe-title">{recipe.title}</h3>
                <div className="recipe-ingredients">
                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    recipe.ingredients.map((ingredient, index) => (
                      <span key={index}>
                        {ingredient.quantity} {ingredient.unit} {
                          (ingredient.category?.toLowerCase() !== 'syrups' && ingredient.category?.toLowerCase() !== 'bottled drinks')
                          ? ingredient.type?.toLowerCase()
                          : ingredient.type
                        }
                        {ingredient.category?.toLowerCase() === 'syrups' && ' syrup'}
                        {index < recipe.ingredients.length - 1 && ", "}
                      </span>
                    ))
                  ) : (
                    <span>No ingredients added yet</span>
                  )}
                </div>
                {/* These are the "viewing buttons" per card */}
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
      {/* === END OF CONTENT AREA === */}

      {/* Popup component remains the same */}
      <AddNewRecipe visible={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
};

export default HomePage;