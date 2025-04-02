import React, { useState } from "react";
import { Button } from "react-bootstrap"; 
import AddNewRecipe from "./AddNewRecipe";

const HomePage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      <Button
        style={{
          ...buttonStyles,
          background: isHovered ? "gray" : "black",
        }}
        onClick={() => setShowPopup(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        Add New Recipe
      </Button>
      <AddNewRecipe visible={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
};

const buttonStyles = {
  width: "100%",
  marginTop: "20px",
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontSize: "19px",
  textAlign: "left",
  cursor: "pointer",
  fontFamily: "Futura, sans-serif",
  color: "white",
  transition: "background-color 0.3s ease", 
};

export default HomePage;

