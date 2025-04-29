import React, { useState } from "react";
import RecipesMain from "./RecipesMain";
import AddAmazonOrders from "./AddAmazonOrders"; 
import './App.css';

function App() {
  const [showRecipesMain, setShowRecipesMain] = useState(false);
  const [showAddAmazonOrders, setShowAddAmazonOrders] = useState(false); 

  return (
    <div className="App">
      <header className="App-header">
        {showRecipesMain ? (
          <RecipesMain onClose={() => setShowRecipesMain(false)} />
        ) : (
          showAddAmazonOrders ? (
             <AddAmazonOrders onClose={() => setShowAddAmazonOrders(false)} />
          ) : (
            <>
              <button
                onClick={() => setShowRecipesMain(true)}
                className="App-button"
              >
                Open Recipe Manager
              </button>
              <button
                 onClick={() => setShowAddAmazonOrders(true)}
                 className="App-button"
              >
                Add Amazon Orders
              </button>
            </>
          )
        )}
      </header>
    </div>
  );
}

export default App;