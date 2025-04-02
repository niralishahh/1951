import React, { useState, useEffect } from "react";

const AddIngredientPopup = ({ visible, onSave, onClose, fetchIngredients, recipeTitle }) => {
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [title, setTitle] = useState("Add Ingredient");

  const categoryToUnit = {
    Milk: "ounces",
    Syrup: "teaspoons",
    Powder: "grams",
    Puree: "cups",
  };

  const categoryToTypes = {
    Milk: ["Oat", "Almond", "Whole"],
    Syrup: ["Lavender", "Vanilla", "Hazelnut"],
    Powder: ["Sugar", "Matcha", "Cocoa"],
    Puree: ["Taro", "Passion Fruit"],
  };

  useEffect(() => {
    if (visible) {
      fetchIngredients().then((data) => setIngredients(data));
      //Use the passed recipeTitle prop from AddNewRecipe. need to implement will save to database as actual title when save is pressed
      setTitle(recipeTitle || "Add Ingredient"); //The default title if none is passed
    }
  }, [visible, fetchIngredients, recipeTitle]);

  const handleSave = () => {
    if (!category || !type || !quantity) return;
    onSave({ category, type, quantity, unit: categoryToUnit[category] });
    setCategory("");
    setType("");
    setQuantity("");
    onClose();
  };

  if (!visible) return null;

  return (
    <div style={popupOverlayStyles}>
      <div style={popupInnerStyles}>
        <h2 style={headerStyles}>{title}</h2>

        <label style={labelStyles}>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={clearDropdownStyles}>
          <option value="">Select Category</option>
          {Object.keys(categoryToUnit).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label style={labelStyles}>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} style={clearDropdownStyles} disabled={!category}>
          <option value="">Select Type</option>
          {categoryToTypes[category]?.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <label style={labelStyles}>Quantity</label>
        <div style={quantityInputContainerStyles}>
          <input
            type="text"
            placeholder="Enter Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={inputStyles}
          />
          {category && <span style={unitStyles}>{categoryToUnit[category]}</span>}
        </div>

        <div style={buttonContainerStyles}>
          <button onClick={handleSave} style={saveButtonStyles}>Save</button>
          <button onClick={onClose} style={cancelButtonStyles}>Cancel</button>
        </div>
      </div>
    </div>
  );
};


// Styles
const popupOverlayStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const popupInnerStyles = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "12px",
  width: "400px", 
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
};

const headerStyles = {
  fontFamily: "Futura",  
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "20px",
  textAlign: "left",
  color: "black"
};

const labelStyles = {
  color: "black",
  fontFamily: "Futura, sans-serif",  
  fontSize: "16px",
  textAlign: "left",
  marginBottom: "5px",  //reduce space between label and input
  marginTop: "15px",  //space above labels
  display: "block",  
};

const clearDropdownStyles = {
  width: "100%",
  padding: "8px",
  marginTop: "5px",  
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid transparent",  //Remove the border!!
  backgroundColor: "#F5F1F1", 
  fontFamily: "Futura, sans-serif", 
  fontSize: "16px",  
};

const inputStyles = {
  width: "100%",
  paddingTop: "10px",  
  paddingRight: "8px", 
  paddingBottom: "10px",  
  paddingLeft: "20px", 
  marginTop: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "1px solid transparent",  //transparent border
  backgroundColor: "#F5F1F1", 
  fontFamily: "Futura, sans-serif",  
  fontSize: "16px"
};

const quantityInputContainerStyles = {
  display: "flex",
  alignItems: "center",
  width: "100%",
  position: "relative",  //UNIT inside the container
  border: "transparent"
};

const unitStyles = {
  marginLeft: "5px",
  color: "black",  
  fontSize: "14px", 
  fontFamily: "Futura, sans-serif", 
  position: "absolute",
  right: "10px", 
};

const ingredientListContainerStyles = {
  marginTop: "20px",
  textAlign: "left",
};

const ingredientListStyles = {
  listStyleType: "none",
  padding: "0",
  fontFamily: "Futura, sans-serif",
  fontSize: "14px",
  color: "gray",
};

const ingredientItemStyles = {
  marginBottom: "5px",
};

const noIngredientsTextStyles = {
  fontFamily: "Futura, sans-serif", 
  fontSize: "14px", 
  color: "gray",  
  textAlign: "left", 
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
  marginRight: "10px",  //space between Save and Cancel buttons
};

const cancelButtonStyles = {
  backgroundColor: "transparent",
  color: "red",
  padding: "12px 20px",
  borderRadius: "6px",
  border: "1px solid red",
  cursor: "pointer",
  fontSize: "16px",
};

export default AddIngredientPopup;




