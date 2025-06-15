import React from "react";

const ViewTheRecipe = ({ visible, onClose, recipe }) => {
  if (!visible || !recipe) return null;

  const handleClose = () => {
    onClose(false);
  };

  return (
    <div style={popupOverlayStyles}>
      <div style={popupStyles}>
        <button style={closeButtonStyles} onClick={handleClose}>&times;</button>

        <div style={{ ...editableTitleStyles, fontSize: "24px" }}>
          {recipe.title}
        </div>

        <div style={{ color: "gray", fontSize: "16px", fontFamily: "Futura", marginTop: "10px", textAlign: "left" }}>
        {recipe.ingredients && recipe.ingredients.length > 0 ? (
  recipe.ingredients.map((ingredient, index) => {
    const typeCapitalized =
      ingredient.type?.charAt(0).toUpperCase() + ingredient.type?.slice(1);

    const displayType =
      ingredient.category?.toLowerCase() === "syrups"
        ? `${typeCapitalized} syrup`
        : ingredient.category?.toLowerCase() === "bottled drinks"
        ? "bottle"
        : ingredient.type?.toLowerCase();

    return (
      <span key={index}>
        {ingredient.quantity} {displayType}
        {index < recipe.ingredients.length - 1 && ", "}
      </span>
    );
  })
) : (
  <span>No ingredients found</span>
)}
        </div>

        <div style={buttonContainerStyles}>
          <button style={saveButtonStyles} onClick={handleClose}>
            Return
          </button>
        </div>
      </div>
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
  color: "black",
  textAlign: "left",
  minHeight: "30px",
  padding: "5px 0",
  fontWeight: "bold",
  fontFamily: "Futura, sans-serif",
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

export default ViewTheRecipe;
