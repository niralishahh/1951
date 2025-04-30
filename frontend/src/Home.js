import React, { useState, useEffect } from "react";
import { Nav, Button } from 'react-bootstrap'; // Use Button consistently
import logo from './logo1951.png';
import { Link, NavLink } from "react-router-dom";
import './App.css';
import RecipesMain from "./RecipesMain";
import AddAmazonOrders from "./AddAmazonOrders";

// Removed 'var lastDate;' as it didn't seem to be used

const Home = () => {
  const getInitialNotifications = () => {
    const today = new Date().toDateString();
    const lastFetchDate = localStorage.getItem('lastNotificationFetchDate');
    const cachedNotificationsRaw = localStorage.getItem('cachedNotifications');

    if (lastFetchDate === today && cachedNotificationsRaw) {
      try {
        const cachedNotifications = JSON.parse(cachedNotificationsRaw);
        return Array.isArray(cachedNotifications) && cachedNotifications.length > 0 ? cachedNotifications : []; // Return empty array if cache is empty string array
      } catch (e) {
        console.error("Failed to parse initial cached notifications:", e);
        return []; // Default if cache is corrupt or empty
      }
    }
    return []; // Default initial state if no valid cache for today
  };

  const [currNotifications, setCurrNotifications] = useState(getInitialNotifications);
  const [loading, setLoading] = useState(false);
  const [showRecipesMain, setShowRecipesMain] = useState(false);
  const [showAddAmazonOrders, setShowAddAmazonOrders] = useState(false);

  // Fetch notifications logic remains the same...
  useEffect(() => {
    const loadAndFetchNotifications = async () => {
      const today = new Date().toDateString();
      const lastFetchDate = localStorage.getItem('lastNotificationFetchDate');
      const cachedNotificationsRaw = localStorage.getItem('cachedNotifications');

      if (lastFetchDate === today && cachedNotificationsRaw) {
         try {
            const cachedData = JSON.parse(cachedNotificationsRaw);
            // Check if cache is valid array (could be empty)
            if (Array.isArray(cachedData)) {
               console.log("Using cached notifications for today.");
               // Update state only if necessary
               if (JSON.stringify(currNotifications) !== cachedNotificationsRaw) {
                 setCurrNotifications(cachedData);
               }
               return;
            }
         } catch (e) {
            console.error("Error reading cache check:", e);
         }
      }

      console.log("Fetching new notifications...");
      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:5000/api/notifications');
        if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        let extractedWarnings = [];
        let topFew = 0;

        if (Array.isArray(data)) {
          data.forEach(doc => {
            if (topFew < 7 && doc?.warnings?.length > 1) { // Use optional chaining
              extractedWarnings.push(doc.warnings[1]);
              topFew++;
            }
          });
        }

        const notificationsToSet = extractedWarnings.length > 0 ? extractedWarnings : [];
        setCurrNotifications(notificationsToSet);
        localStorage.setItem('cachedNotifications', JSON.stringify(notificationsToSet));
        localStorage.setItem('lastNotificationFetchDate', today);
        console.log("Notifications fetched and cached.");

      } catch (err) {
        console.error("Error fetching notifications:", err);
        if (cachedNotificationsRaw) {
           try {
              const cachedNotifications = JSON.parse(cachedNotificationsRaw);
              if (Array.isArray(cachedNotifications)) {
                 setCurrNotifications(cachedNotifications);
                 console.log("Loaded stale notifications from cache due to fetch error.");
              } else {
                 setCurrNotifications([]); // Ensure it's an array
              }
           } catch (e) {
              console.error("Failed to parse cached notifications during error fallback:", e);
               setCurrNotifications([]);
           }
        } else {
           setCurrNotifications([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadAndFetchNotifications();

    const intervalId = setInterval(() => {
      const today = new Date().toDateString();
      const lastFetchDate = localStorage.getItem('lastNotificationFetchDate');
      if (lastFetchDate !== today) {
        console.log("Date changed while app open, fetching new notifications.");
        loadAndFetchNotifications();
      }
    }, 60 * 60 * 1000);

    return () => clearInterval(intervalId);

  }, []); // Keep empty dependency array

  // Define button styles (can be moved outside component if static)
  const buttonStyles = {
    // width: "auto", // Auto width allows wrapping
    padding: "10px 15px",
    borderRadius: "10px",
    fontSize: "16px", // Slightly smaller font size?
    textAlign: "center",
    cursor: "pointer",
    fontFamily: "Futura, sans-serif", // Keep Futura if desired
    // Let variant handle color/background
    // Removed margins, using gap now
    flexGrow: 0, // Don't grow
    flexShrink: 0 // Don't shrink
  };


  return (
    <div>
      {/* Navbar - Unchanged */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #dee2e6"
      }}>
        <img src={logo} style={{ height: "50px", width: "auto" }} alt="1951 Coffee Company Logo"/>
        <Nav>
           {/* Using NavLink with className function for active state (assuming react-router-dom v6+) */}
           <Nav.Item>
              <NavLink to="/Home.js" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Home</NavLink>
           </Nav.Item>
           <Nav.Item>
              <NavLink to="/Inventory" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Inventory</NavLink>
           </Nav.Item>
           <Nav.Item>
              <NavLink to="/RecipesMain.js" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Recipe</NavLink>
           </Nav.Item>
        </Nav>
      </div>
      <div style={{ display: 'flex', padding: '20px', gap: '20px' }}>

        <div style={{
           flex: '1', // Adjust flex ratio if needed (e.g., flex: 2 for wider)
           display: 'flex',
           flexWrap: 'wrap', // Allows buttons to wrap to new lines
           gap: '10px', // Spacing between buttons horizontally and vertically
           alignContent: 'flex-start' // Start placing items from the top-left
         }}>
          <Button style={buttonStyles} variant="dark">Update Amazon History ⊕</Button>
          <Button style={buttonStyles} variant="dark">View Data Tables ⊕</Button>
          <Button style={buttonStyles} variant="dark">Amazon Price Tracking Tool ⊕</Button>
          <Button style={buttonStyles} variant="dark">Cut+Dry Price Tracking Tool ⊕</Button>
          {showAddAmazonOrders ? (
             <div style={{width: '100%'}}><AddAmazonOrders onClose={() => setShowAddAmazonOrders(false)} /></div>
          ) : (
               <Button
                 style={buttonStyles} // Use consistent style object
                 variant="secondary" // Example: different variant for these?
                 onClick={() => setShowAddAmazonOrders(true)}
                 // Removed className="App-button"
               >
                 Update Amazon History {/* Note: Duplicate text with first button */}
               </Button>
          )}
        </div>
        <div style={{
          flex: '1', // Adjust flex ratio if needed (e.g., flex: 1.5 for narrower)
          border: "1px solid #d3d3d3",
          borderRadius: "10px",
          overflow: "hidden", // Prevents content spillover
          display: 'flex', // Use flex column for vertical layout inside
          flexDirection: 'column'
        }}>
          <h2 style={{
             padding: "10px 20px",
             margin: 0,
             borderBottom: "1px solid #dee2e6", // Use consistent border color
             flexShrink: 0 // Prevent header from shrinking
             }}>
             Notifications ({loading ? 'Checking...' : currNotifications.length})
          </h2>
          <div style={{
             flexGrow: 1, // Allow this area to grow and fill space
             overflowY: 'auto', // Add scrollbar if content exceeds height
             borderBottom: "1px solid #dee2e6" // Border above footer
             }}>
              <div style={{padding: "10px 20px", backgroundColor: "#f8f9fa", borderTop: "1px solid #dee2e6"}}>Today</div>

              {loading && currNotifications.length === 0 && // Show loading indicator only if list is empty
                 <div style={{padding: "15px 20px"}}>Loading notifications...</div>
              }
              {!loading && currNotifications.length === 0 && // Show 'no notifications' message
                 <div style={{padding: "15px 20px"}}>No new notifications.</div>
              }
              {currNotifications.map((notification, index) => (
                 <div key={index} style={{
                   borderTop: "1px solid #dee2e6",
                   padding: "15px 20px",
                 }}>
                   {/* Handle potential empty strings in notifications */}
                   <span>{notification || "* Notification text missing *"}</span>
                 </div>
               ))}
          </div>
          <div style={{
            padding: "10px 20px",
            display: "flex",
            justifyContent: "flex-start", 
            flexShrink: 0 
          }}>
            <Link to="/Notifications.js">
              <Button variant="primary" size="sm">
                View All Notifications
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;