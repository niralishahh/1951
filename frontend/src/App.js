import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Home';
import Notifications from './Notifications';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (

    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home.js" element={<Home />} />
        <Route path="/Notifications.js" element={<Notifications />} />
        {/* <Route path="/Inventory" element={<Inventory />} />
        <Route path="/Recipe" element={<Recipe />} /> */}
      </Routes>
    </Router>
  );
}

export default App;