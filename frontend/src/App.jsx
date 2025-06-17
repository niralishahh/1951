import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './assets/images/logo.svg';
import Home from './pages/Home/Home.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <nav className="mb-4">
            <Link to="/" className="mr-4 text-blue-300 hover:text-blue-100">
              Home
            </Link>
          </nav>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 