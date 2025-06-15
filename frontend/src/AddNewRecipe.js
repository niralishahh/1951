import React, { useState } from "react";
import AddIngredientPopup from "./IngredientDrownDownPopup";
import plusicon from './plusicon.png';

const AddNewRecipe = ({ visible, onClose }) => {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [showIngredientPopup, setShowIngredientPopup] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");

  const handleAddIngredient = (newIngredient) => {
    setIngredients([...ingredients, newIngredient]);
    setShowIngredientPopup(false);
  };

  const handleFinish = async () => {
    if (!recipeTitle || ingredients.length === 0 || !selectedLabel) {
      alert("Please enter a recipe title, add at least one ingredient, and select a label.");
      return;
    }

    // Map for category to unit
    const categoryToUnit = {
      "Liquid Ingredients": "oz",
      "Dry Ingredients": "grams",
      "Syrups": "grams",
      "Bottled Drinks": "bottle",
      "Other": "units", 
    };


    const labelMapping = {
      "hot": "Hot Drinks",
      "iced": "Iced Drinks",
    };

    const recipeData = {
      title: recipeTitle,
      ingredients: ingredients.map((ingredient) => ({
        category: ingredient.category,
        type: ingredient.type,
        quantity: `${ingredient.quantity} ${categoryToUnit[ingredient.category] || ''}`, 
      })),
      tags: labelMapping[selectedLabel] || "", 
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeData),
      });

      if (response.ok) {
        console.log("Saved Recipe:", recipeData);
        setRecipeTitle("");
        setIngredients([]);
        setSelectedLabel("");  
        onClose(true);  
      } else {
        console.error("Failed to save recipe");
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  const handleTitleChange = (e) => {
    setRecipeTitle(e.target.value);
  };

  const handleClose = () => {
    setRecipeTitle("");
    setIngredients([]);
    setSelectedLabel("");
    onClose(false); 
  };

  if (!visible) return null;

  return (
    <div style={popupOverlayStyles}>
      <div style={popupStyles}>
        <button style={closeButtonStyles} onClick={handleClose}>&times;</button>

        <input
          type="text"
          value={recipeTitle}
          onChange={handleTitleChange}
          placeholder="Enter Recipe Title"
          style={editableTitleStyles}
        />

        <div style={{ color: "gray", fontSize: "16px", fontFamily: "Futura", marginTop: "10px", textAlign: "left" }}>
          {ingredients && ingredients.length > 0 ? (
            ingredients.map((ingredient, index) => (
              <span key={index}>
                {ingredient.quantity} {ingredient.unit} {
                  (ingredient.category.toLowerCase() !== 'syrups' && ingredient.category.toLowerCase() !== 'bottled drinks') 
                  ? ingredient.type.toLowerCase() 
                  : ingredient.type
                }
                {ingredient.category.toLowerCase() === 'syrups' && ' syrup'}
                {index < ingredients.length - 1 && ", "}
              </span>
            ))
          ) : (
            <span>No ingredients added yet</span>
          )}
        </div>

        <label style={labelStyles}></label>
        <select
          value={selectedLabel}
          onChange={(e) => setSelectedLabel(e.target.value)}
          style={clearDropdownStyles}
        >
          <option value="">Select Label</option>
          <option value="hot">Hot Drinks</option>
          <option value="iced">Iced Drinks</option>
        </select>

        <button style={dropdownStyles} onClick={() => setShowIngredientPopup(true)}>
          <img src={plusicon} alt="add icon" style={iconStyles} /> Add Ingredient
        </button>

        <div style={buttonContainerStyles}>
          <button style={saveButtonStyles} onClick={handleFinish}>Save</button>
        </div>
      </div>

      <AddIngredientPopup 
        visible={showIngredientPopup} 
        onSave={handleAddIngredient} 
        onClose={() => setShowIngredientPopup(false)}
        currentIngredients={ingredients}
      />
    </div>
  );
};

const popupOverlayStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const popupStyles = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "12px",
  width: "400px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  position: "relative",
};

const closeButtonStyles = {
  position: "absolute",
  top: "10px",
  right: "10px",
  fontSize: "20px",
  background: "none",
  border: "none",
  cursor: "pointer",
};

const editableTitleStyles = {
  width: "100%",
  fontSize: "24px",
  color: "black",
  textAlign: "left",
  minHeight: "30px",
  outline: "none",
  border: "none", 
  borderBottom: "2px solid black", 
  padding: "5px 0",
  fontWeight: "bold",
  fontFamily: "Futura, sans-serif",
};

const dropdownStyles = {
  width: "100%",
  marginTop: "9px",
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  background: "white",
  fontSize: "19px",
  textAlign: "left",
  cursor: "pointer",
  fontFamily: "Futura, sans-serif",
  color: "black",
};

const iconStyles = {
  marginRight: "10px",  
  width: "29.5px",  
  height: "27px",
};


const buttonContainerStyles = {
  marginTop: "20px",
  display: "flex",
  justifyContent: "center",
};

const saveButtonStyles = {
  backgroundColor: "black",
  color: "white",
  padding: "12px 20px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
};

const labelStyles = {
  color: "black",
  fontFamily: "Futura, sans-serif",
  fontSize: "16px",
  textAlign: "left",
  marginBottom: "5px",
  marginTop: "15px",
  display: "block",
};

const clearDropdownStyles = {
  width: "100%",
  padding: "8px",
  marginTop: "5px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid transparent",
  backgroundColor: "#F5F1F1",
  fontFamily: "Futura, sans-serif",
  fontSize: "16px",
};


export default AddNewRecipe;