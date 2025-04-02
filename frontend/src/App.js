import React, { useState } from "react";
import RecipesMain from "./RecipesMain"; 
import './App.css';

function App() {
  const [showRecipesMain, setShowRecipesMain] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        {!showRecipesMain ? (
          <button onClick={() => setShowRecipesMain(true)} className="App-button">
            Open Recipe Manager
          </button>
        ) : (
          <RecipesMain onClose={() => setShowRecipesMain(false)} />
        )}
      </header>
    </div>
  );
}

export default App;

