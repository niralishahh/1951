import React, { useState } from "react";
import EditRecipeIngredientPopup from "./EditRecipeIngredientPopup";
import AddIngredientPopup from "./IngredientDrownDownPopup";
import plusiconinverted from "./plusiconinverted.png";

const EditRecipe = ({ recipe, visible, onClose, onSave }) => {
  const [recipeTitle, setRecipeTitle] = useState(recipe.title || "");
  const [ingredients, setIngredients] = useState(recipe.ingredients || []);
  const [selectedLabel, setSelectedLabel] = useState(recipe.tags?.includes("Hot") ? "hot" : "iced");
  const [ingredientToEdit, setIngredientToEdit] = useState(null);
  const [showIngredientPopup, setShowIngredientPopup] = useState(false);

  const labelMapping = {
    hot: "Hot Drinks",
    iced: "Iced Drinks",
  };

  const normalizeCategory = (cat) => {
    if (!cat) return "";
    const lower = cat.toLowerCase();
    if (lower.includes("syrup")) return "Syrups";
    if (lower.includes("ingredients")) return "Dry Ingredients";
    if (lower.includes("liquid")) return "Liquid Ingredients";
    if (lower.includes("bottled")) return "Bottled Drinks";
    return "Other";
  };
  

  const handleIngredientUpdate = (updatedIngredient, index) => {
    const updated = [...ingredients];
    updated[index] = updatedIngredient;
    setIngredients(updated);
  };

  const handleAddIngredient = (newIngredient) => {
    setIngredients([...ingredients, newIngredient]);
    setShowIngredientPopup(false);
  };

  const handleDeleteIngredient = async () => {
    if (!ingredientToEdit || ingredientToEdit.index === undefined) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/recipes/${recipe._id}/ingredients/${ingredientToEdit.index}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const updated = [...ingredients];
        updated.splice(ingredientToEdit.index, 1);
        setIngredients(updated);
        setIngredientToEdit(null);
      } else {
        console.error("Failed to delete ingredient:", await response.text());
      }
    } catch (err) {
      console.error("Error deleting ingredient:", err);
    }
  };

  const handleSave = async () => {
    if (!recipeTitle || ingredients.length === 0 || !selectedLabel) {
      alert("Please fill out all fields");
      return;
    }

    const updatedRecipe = {
      title: recipeTitle,
      tags: labelMapping[selectedLabel],
      ingredients,
    };

    try {
      const res = await fetch(`http://127.0.0.1:5000/recipes/${recipe._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRecipe),
      });

      if (res.ok) {
        console.log("Recipe updated successfully");
        onSave();
        onClose();
      } else {
        console.error("Failed to update recipe", await res.text());
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  if (!visible) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <button onClick={onClose} style={closeButton}>&times;</button>

        <input
          style={titleStyle}
          value={recipeTitle}
          onChange={(e) => setRecipeTitle(e.target.value)}
          placeholder="Edit Recipe Title"
        />

        <label style={labelStyle}>Label</label>
        <select
          value={selectedLabel}
          onChange={(e) => setSelectedLabel(e.target.value)}
          style={dropdownStyle}
        >
          <option value="hot">Hot Drinks</option>
          <option value="iced">Iced Drinks</option>
        </select>

        <label style={labelStyle}>Ingredients</label>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {ingredients.map((ing, i) => {
            const categoryLower = ing.category?.toLowerCase() || "";
            const displayText =
              categoryLower !== "syrups" && categoryLower !== "bottled drinks"
                ? ing.type.toLowerCase()
                : ing.type;

            return (
              <li
                key={i}
                style={ingredientItem}
                onClick={() =>
                  setIngredientToEdit({
                    data: {
                      ...ing,
                      category: normalizeCategory(ing.category),
                      type: ing.type,
                    },
                    index: i,
                  })
                }                
              >
                {ing.quantity} {ing.unit} {displayText}
                {categoryLower === "syrups" && " syrup"}
              </li>
            );
          })}
        </ul>

        <button
          style={dropdownStyles}
          onClick={() => setShowIngredientPopup(true)}
        >
          <img src={plusiconinverted} alt="add icon" style={iconStyles} />
          Add Ingredient
        </button>

        <AddIngredientPopup
          visible={showIngredientPopup}
          onSave={handleAddIngredient}
          onClose={() => setShowIngredientPopup(false)}
          currentIngredients={ingredients}
        />

        <button style={saveBtn} onClick={handleSave}>Save Changes</button>

        {ingredientToEdit && (
          <EditRecipeIngredientPopup
  visible={true}
  ingredient={ingredientToEdit.data}
  selectedIndex={ingredientToEdit.index}
  recipeId={recipe._id}
  ingredients={ingredients}
  setIngredients={setIngredients}
  setPopupVisible={() => setIngredientToEdit(null)}
  onSave={(updatedIngredient) => {
    handleIngredientUpdate(updatedIngredient, ingredientToEdit.index);
    setIngredientToEdit(null);
  }}
  onCancel={() => setIngredientToEdit(null)}  
/>
)}
      </div>
    </div>
  );
};


const overlay = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.3)",
  display: "flex", justifyContent: "center", alignItems: "center"
};

const modal = {
  backgroundColor: "white", padding: "25px", borderRadius: "12px",
  width: "400px", position: "relative", textAlign: "center"
};

const closeButton = {
  position: "absolute", top: "10px", right: "10px",
  fontSize: "20px", border: "none", background: "none", cursor: "pointer"
};

const titleStyle = {
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

const labelStyle = {
  textAlign: "left", marginTop: "15px", color: "black", fontFamily: "Futura"
};

const ingredientItem = {
  padding: "8px", border: "1px solid #ddd", marginBottom: "5px",
  borderRadius: "6px", cursor: "pointer", backgroundColor: "#f9f9f9"
};

const dropdownStyle = {
  width: "100%",
  padding: "8px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#F5F1F1",
  fontFamily: "Futura",
  fontSize: "16px",
  outline: "none" 
};

const saveBtn = {
  marginTop: "20px", backgroundColor: "black", color: "white",
  padding: "12px 20px", borderRadius: "6px", border: "none", cursor: "pointer"
};

const dropdownStyles = {
  width: "100%", padding: "10px", backgroundColor: "white",
  color: "black", border: "1px solid #ccc",
  borderRadius: "6px", display: "flex",
  alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "10px",
  cursor: "pointer", fontFamily: "Futura"
};


const iconStyles = {
  width: "20px",
  height: "20px",
  filter: "invert(1)",
};



export default EditRecipe;