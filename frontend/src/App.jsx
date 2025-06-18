import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home/Home.jsx';
import RecipesMain from './pages/Recipes/RecipesMain.jsx';
import Recipes from './pages/Recipes/Recipes.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes-main" element={<RecipesMain />} />
            <Route path="/recipes" element={<Recipes />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 