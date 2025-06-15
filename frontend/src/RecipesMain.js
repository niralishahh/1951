import React, { useState, useEffect } from "react";
import AddNewRecipe from "./AddNewRecipe";
import ViewTheRecipe from "./ViewRecipe";
import EditRecipe from "./EditRecipe"; 
import "./App.css";
import logo1951 from "./logo1951.png";
import plusiconinverted from "./plusiconinverted.png";

const DeleteConfirmationPopup = ({ visible, recipeTitle, onConfirm, onCancel }) => {
  if (!visible) return null;

  return (
    <div style={popupOverlayStyles}>
      <div style={popupInnerStyles}>
        <button onClick={onCancel} style={closeButtonStyle}>×</button>

        <h2 style={headerStyles}>Delete Recipe</h2>
        <p style={{ marginBottom: "20px" }}>
          Are you sure you want to delete <strong>{recipeTitle}</strong>?
        </p>

        <div style={buttonContainerStyles}>
          <button onClick={onConfirm} style={deleteButtonStyles}>Delete</button>
        </div>
      </div>
    </div>
  );
};

const popupOverlayStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const popupInnerStyles = {
  position: "relative", 
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "12px",
  width: "350px",
  textAlign: "center",
};

const headerStyles = {
  marginBottom: "20px",
  fontSize: "22px",
  fontWeight: "bold"
};

const buttonContainerStyles = {
  display: "flex",
  justifyContent: "space-around",
};

const deleteButtonStyles = {
  backgroundColor: "transparent",
  color: "red",
  padding: "12px 20px",
  borderRadius: "6px",
  border: "1px solid red",
  cursor: "pointer",
  fontSize: "16px",
};

const closeButtonStyle = {
  position: "absolute",
  top: "10px",
  right: "15px",
  fontSize: "22px",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#aaa",
};



const HomePage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false); 
  const [activeTab, setActiveTab] = useState("Hot Drinks");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);


  const tabs = ["Hot Drinks", "Iced Drinks"];

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch(`http://127.0.0.1:5000/api/recipes?tags=${encodeURIComponent(activeTab)}`);
      const data = await response.json();
      setRecipes(data);
    };

    fetchRecipes();
  }, [activeTab]);

  const refreshRecipes = async () => {
    const response = await fetch(`http://127.0.0.1:5000/api/recipes?tags=${encodeURIComponent(activeTab)}`);
    const data = await response.json();
    setRecipes(data);
  };

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setShowViewPopup(true);
  };

  const handleCloseView = () => {
    setSelectedRecipe(null);
    setShowViewPopup(false);
  };

  const handleEditRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setShowEditPopup(true);
  };

  const confirmDeleteRecipe = async () => {
    if (!recipeToDelete) return;
  
    try {
      const response = await fetch(`http://127.0.0.1:5000/recipes/${recipeToDelete._id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        setShowDeletePopup(false);
        setRecipeToDelete(null);
        await refreshRecipes();
      } else {
        const data = await response.json();
        alert("Error deleting recipe: " + (data.error || response.statusText));
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete recipe. See console for details.");
    }
  };  

  const handleDeleteRecipe = async (recipeId) => {
    const confirmed = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirmed) return;
  
    try {
      const response = await fetch(`http://127.0.0.1:5000/recipes/${recipeId}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        alert("Recipe deleted successfully");
        refreshRecipes(); 
      } else {
        const data = await response.json();
        alert("Error deleting recipe: " + data.error || response.statusText);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete recipe. See console for details.");
    }
  };
  
  const handleCloseEdit = () => {
    setSelectedRecipe(null);
    setShowEditPopup(false);
  };

  const filteredRecipes = recipes.filter((recipe) => recipe.tags === activeTab);

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
                <h3 className="recipe-title">{recipe.title}</h3>
                
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
                  <button className="action-btn" onClick={() => handleViewRecipe(recipe)}>View</button>
                  <button className="action-btn" onClick={() => handleEditRecipe(recipe)}>Edit</button> 
                  <button className="action-btn" onClick={() => {
  setRecipeToDelete(recipe);
  setShowDeletePopup(true);
}}>
  Delete
</button>
                </div>
              </div>
            ))
          ) : (
            <p>No recipes found for {activeTab}</p>
          )}
        </div>
      </div>

      <AddNewRecipe visible={showPopup} onClose={() => setShowPopup(false)} />

      {showViewPopup && selectedRecipe && (
        <ViewTheRecipe
          visible={showViewPopup}
          onClose={handleCloseView}
          recipe={selectedRecipe}
        />
      )}

      {showEditPopup && selectedRecipe && (
        <EditRecipe
          visible={showEditPopup}
          recipe={selectedRecipe}
          onClose={handleCloseEdit}
          onSave={refreshRecipes} 
        />
      )}

{showDeletePopup && recipeToDelete && (
  <DeleteConfirmationPopup
    visible={showDeletePopup}
    recipeTitle={recipeToDelete.title}
    onConfirm={confirmDeleteRecipe}
    onCancel={() => {
      setShowDeletePopup(false);
      setRecipeToDelete(null);
    }}
  />
)}
    </div>
  );
};

export default HomePage;


