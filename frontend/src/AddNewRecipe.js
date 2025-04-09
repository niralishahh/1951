import React, { useState, useEffect } from 'react';
import AddIngredientPopup from "./IngredientDrownDownPopup";
import plusicon from './plusicon.png';

const AddNewRecipe = ({ visible, onClose }) => {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [showIngredientPopup, setShowIngredientPopup] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddIngredient = (newIngredient) => {
    setIngredients([...ingredients, newIngredient]); 
    setShowIngredientPopup(false);
  };

  const handleFinish = () => {
    console.log("Recipe Saved:", recipeTitle, ingredients);
    onClose();
  };

  const handleTitleChange = (e) => {
    setRecipeTitle(e.target.value);
  };

  if (!visible) return null;

  return (
    <div style={popupOverlayStyles}>
      <div style={popupStyles}>
        <button style={closeButtonStyles} onClick={onClose}>&times;</button>

        <input
          type="text"
          value={recipeTitle}
          onChange={handleTitleChange}
          placeholder="Enter Recipe Title"
          style={editableTitleStyles}
        />

        <div style={{ color: "gray", fontSize: "16px", fontFamily: "Futura", marginTop: "10px", textAlign: "left" }}>
          {ingredients.map((ingredient, index) => 
            `${ingredient.quantity} ${ingredient.unit} ${ingredient.type.toLowerCase()} ${ingredient.category.toLowerCase()}`
          ).join(", ")}
        </div>

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
        fetchIngredients={fetchIngredients}
        fetchTitle={fetchTitle}
        recipeTitle={recipeTitle} //Pass recipeTitle as prop here** for ingredientdrowndownpopup
      />
    </div>
  );
};

const fetchIngredients = async () => {
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve(["Milk", "Matcha", "Lavender"]);
      }, 1000);
  });
};

const fetchTitle = async () => {
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve("Custom Ingredient Title");
      }, 500);
  });
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
  border: "none", //no border
  borderBottom: "2px solid black", //only bottom border
  padding: "5px 0",
  fontWeight: "bold",
  fontFamily: "Futura, sans-serif",
};

const dropdownStyles = {
  width: "100%",
  marginTop: "20px",
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

const ingredientListStyles = {
  marginTop: "10px",
  textAlign: "left",
  display: "flex",
  flexDirection: "column",
  gap: "5px",
};

const ingredientItemStyles = {
  backgroundColor: "#F5F1F1",
  padding: "10px",
  borderRadius: "6px",
  fontSize: "16px",
  fontFamily: "Futura",
  color: "gray"
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

export default AddNewRecipe;

