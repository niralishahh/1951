import React, { useState, useEffect } from "react";

const EditRecipeIngredientPopup = ({
  visible,
  ingredient,
  selectedIndex,
  recipeId,
  ingredients,
  setIngredients,
  setPopupVisible,
  onSave,
  onCancel
}) => {
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categoryToIngredients, setCategoryToIngredients] = useState({});

  const categoryToUnit = {
    "Liquid Ingredients": "oz",
    "Dry Ingredients": "grams",
    "Syrups": "grams",
    "Bottled Drinks": "bottle",
    "Other": "units"
  };

  useEffect(() => {
    if (visible) {
      setCategory(ingredient.category || "");
      setType(ingredient.type || "");
      setQuantity(ingredient.quantity || "");

      fetch("http://127.0.0.1:5000/api/category-to-ingredients")
        .then((res) => res.json())
        .then((data) => {
          setCategoryToIngredients(data);
          console.log("Fetched category-to-ingredients:", data);
        })
        .catch((err) => console.error("Failed to fetch categories", err));
    }
  }, [visible, ingredient]);

  const handleSave = async () => {
    if (!category || !type || !quantity) return;
  

    const updatedIngredient = {
      category,
      type,
      quantity,
      unit: categoryToUnit[category],
    };
  
    try {
   
      const newIngredients = [...ingredients];
      if (selectedIndex !== null) {

        newIngredients[selectedIndex] = updatedIngredient;
      } else {
 
        newIngredients.push(updatedIngredient);
      }
  

      const response = await fetch(`http://127.0.0.1:5000/recipes/${recipeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: newIngredients }),
      });
  
      if (response.ok) {
       
        setIngredients(newIngredients);
        onSave(updatedIngredient); 
        onCancel(); 
      } else {
        console.error("Failed to save ingredient update");
      }
    } catch (err) {
      console.error("Error saving ingredient update:", err);
    }
  };  

  const handleDelete = async () => {
    if (selectedIndex === null || !recipeId) return;
  
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/recipes/${recipeId}/ingredients/${selectedIndex}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        const updatedIngredients = ingredients.filter((_, i) => i !== selectedIndex);
        setIngredients(updatedIngredients);
        setPopupVisible(false);
      } else {
        console.error("Failed to delete ingredient");
      }
    } catch (err) {
      console.error("Error deleting ingredient:", err);
    }
  };  
  

  if (!visible) return null;

  return (
    <div style={popupOverlayStyles}>
      <div style={popupInnerStyles}>
        <button onClick={onCancel} style={closeButtonStyles} aria-label="Close popup">
          &times;
        </button>

        <h2 style={headerStyles}>Edit Ingredient</h2>

        <label style={labelStyles}>Edit Category</label>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setType("");
          }}
          style={clearDropdownStyles}
        >
          <option value="">Select Category</option>
          {Object.keys(categoryToUnit).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label style={labelStyles}>Edit Item</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={clearDropdownStyles}
          disabled={!category}
        >
          <option value="">Select Item</option>
          {category &&
            categoryToIngredients[category]?.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
        </select>

        <label style={labelStyles}>Edit Quantity</label>
        <div style={quantityInputContainerStyles}>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter Quantity"
            style={inputStyles}
          />
          {category && <span style={unitStyles}>{categoryToUnit[category]}</span>}
        </div>

        <div style={buttonContainerStyles}>
          <button style={saveButtonStyles} onClick={handleSave}>Save</button>
          <button style={cancelButtonStyles} onClick={handleDelete}>Delete</button>
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
  position: "relative",
};

const closeButtonStyles = {
  position: "absolute",
  top: "10px",
  right: "15px",
  fontSize: "24px",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "black",
  fontWeight: "bold",
  lineHeight: "1",
  padding: 0,
};

const headerStyles = {
  fontFamily: "Futura",
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "20px",
  textAlign: "left",
  color: "black",
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

const inputStyles = {
  width: "100%",
  paddingTop: "10px",
  paddingRight: "8px",
  paddingBottom: "10px",
  paddingLeft: "20px",
  marginTop: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "1px solid transparent",
  backgroundColor: "#F5F1F1",
  fontFamily: "Futura, sans-serif",
  fontSize: "16px",
};

const quantityInputContainerStyles = {
  display: "flex",
  alignItems: "center",
  width: "100%",
  position: "relative",
};

const unitStyles = {
  marginLeft: "5px",
  color: "black",
  fontSize: "14px",
  fontFamily: "Futura, sans-serif",
  position: "absolute",
  right: "10px",
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
  marginRight: "10px",
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

export default EditRecipeIngredientPopup;

