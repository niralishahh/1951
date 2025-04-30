import React, { useState, useEffect } from "react";
import { Nav, Button } from 'react-bootstrap';
import logo from './Screenshot 2025-04-15 at 7.01.33 PM.png';
import { Link, NavLink } from "react-router-dom";
import './App.css';
import RecipesMain from "./RecipesMain";
import AddAmazonOrders from "./AddAmazonOrders"; 



var lastDate;

const Home = () => {
  const getInitialNotifications = () => {
    const today = new Date().toDateString();
    const lastFetchDate = localStorage.getItem('lastNotificationFetchDate');
    const cachedNotificationsRaw = localStorage.getItem('cachedNotifications');

    if (lastFetchDate === today && cachedNotificationsRaw) {
      try {
        const cachedNotifications = JSON.parse(cachedNotificationsRaw);
        // Return cached data only if it's a non-empty array
        return Array.isArray(cachedNotifications) && cachedNotifications.length > 0 ? cachedNotifications : [""];
      } catch (e) {
        console.error("Failed to parse initial cached notifications:", e);
        return [""]; // Default if cache is corrupt
      }
    }
    return [""]; // Default initial state if no valid cache for today
  };

  const [currNotifications, setCurrNotifications] = useState(getInitialNotifications);
  const [loading, setLoading] = useState(false); // Added loading state
  const [showRecipesMain, setShowRecipesMain] = useState(false);
  const [showAddAmazonOrders, setShowAddAmazonOrders] = useState(false);   


  // Fetch notifications once daily, using cache if possible
  useEffect(() => {
    const loadAndFetchNotifications = async () => {
      const today = new Date().toDateString();
      const lastFetchDate = localStorage.getItem('lastNotificationFetchDate');
      const cachedNotificationsRaw = localStorage.getItem('cachedNotifications');

      // Check if we already have valid data for today (either from initial state or previous load)
      if (lastFetchDate === today && cachedNotificationsRaw) {
         try {
            // Double check cache isn't just the initial empty string array [""]
            const cachedData = JSON.parse(cachedNotificationsRaw);
            if (Array.isArray(cachedData) && cachedData.length > 0) {
               console.log("Using cached notifications for today.");
               // Ensure state reflects cache if initial load missed it for some reason
               if (JSON.stringify(currNotifications) !== cachedNotificationsRaw) {
                 setCurrNotifications(cachedData);
               }
               return; // No need to fetch
            }
         } catch (e) {
            console.error("Error reading cache check:", e);
            // Proceed to fetch if cache is invalid
         }
      }

      // If we reach here, it's a new day or the cache was invalid/empty. Time to fetch.
      console.log("Fetching new notifications...");
      setLoading(true);
      try {
        // Use the endpoint that also triggers the daily check on the backend
        const response = await fetch('http://127.0.0.1:5000/api/notifications');
        if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        let extractedWarnings = [];
        let topFew = 0; // Counter for limiting notifications

        if (Array.isArray(data)) {
          // Process newest entries first (assuming backend sorts newest first)
          data.forEach(doc => {
            // Get the abridged warning (assuming it's the second element)
            if (topFew < 7 && doc && doc.warnings && Array.isArray(doc.warnings) && doc.warnings.length > 1) {
              extractedWarnings.push(doc.warnings[1]);
              topFew++;
            }
          });
        }

        // Use extracted warnings if found, otherwise maybe set to empty or a 'no notifications' message
        const notificationsToSet = extractedWarnings.length > 0 ? extractedWarnings : []; // Use empty array if no warnings

        setCurrNotifications(notificationsToSet);
        localStorage.setItem('cachedNotifications', JSON.stringify(notificationsToSet)); // Cache the result (even if empty)
        localStorage.setItem('lastNotificationFetchDate', today); // Update the fetch date
        console.log("Notifications fetched and cached.");

      } catch (err) {
        console.error("Error fetching notifications:", err);
        // Optional: Try to load from cache as a fallback even if fetch fails, if cache exists
        if (cachedNotificationsRaw) {
           try {
              const cachedNotifications = JSON.parse(cachedNotificationsRaw);
              if (Array.isArray(cachedNotifications)) { // Check if it's an array before setting
                 setCurrNotifications(cachedNotifications);
                 console.log("Loaded stale notifications from cache due to fetch error.");
              }
           } catch (e) {
              console.error("Failed to parse cached notifications during error fallback:", e);
               setCurrNotifications([]); // Set to empty on cache parse error during fallback
           }
        } else {
           setCurrNotifications([]); // Set to empty if fetch fails and no cache exists
        }
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };

    // Run the check/fetch logic when the component mounts
    loadAndFetchNotifications();

    // Set up an interval to re-check if the day has changed while the app is open
    // This handles the case where the user leaves the app open past midnight
    const intervalId = setInterval(() => {
      const today = new Date().toDateString();
      const lastFetchDate = localStorage.getItem('lastNotificationFetchDate');
      if (lastFetchDate !== today) {
        console.log("Date changed while app open, fetching new notifications.");
        loadAndFetchNotifications(); // Re-run the fetch logic if the date has changed
      }
    }, 60 * 60 * 1000); // Check every hour (3600000 ms)

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);

  }, []); // ---> Empty dependency array is CORRECT <---
          // This ensures the setup (initial check/fetch + interval setup) runs ONLY ONCE when the component mounts.
          // The logic *inside* the effect determines whether to actually fetch based on the date comparison.

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #dee2e6"
      }}>
        <img src={logo} width="120" height="60" />
        <Nav activeKey="/Home.js">
        <Nav.Item>
            <NavLink to="/Home.js" className="nav-link">Home</NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/Inventory" className="nav-link">Inventory</NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/Recipe" className="nav-link">Recipe</NavLink>
        </Nav.Item>
        </Nav>
      </div>
     
      {/*<div style={{display: "flex", padding: "20px", justifyContent: "space-evenly"}}> */}
      <div>
        <header className="App-header">
        <Button style={styles} variant="dark">Update Amazon History ⊕</Button>
        <Button style={styles} variant="dark">View Data Tables ⊕</Button>
        <Button style={styles} variant="dark">Amazon Price Tracking Tool ⊕</Button>
        <Button style={styles} variant="dark">Cut+Dry Price Tracking Tool ⊕</Button>


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
                  Update Amazon History
                </button>
              </>
            )
          )}
        </header>
        
         {/* 
        <Button style={styles} variant="dark">Update Order History ⊕</Button>
        <Button style={styles} variant="dark">View Data Table ⊕</Button>
        <Button style={styles} variant="dark">Price Tracking Tool ⊕</Button>
        
        <div style={{
          flex: "1 1 400px",
          border: "1px solid #d3d3d3",
          borderRadius: "10px",
          overflow: "hidden",
          textAlign: "left",
          marginLeft: "20px"
        }}>
        */}
          <h2 style={{padding: "10px 20px", margin: 0}}>Notifications ({currNotifications.length})</h2>
          
          <div style={{borderTop: "1px solid #dee2e6"}}>
            <div style={{padding: "10px 20px", backgroundColor: "#f8f9fa"}}>Today</div>
            
            {currNotifications.map((notification, index) => (
              <div key={index} style={{
                borderTop: "1px solid #dee2e6",
                padding: "15px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span>{notification}</span>
              </div>
            ))}
            
            <div style={{
              borderTop: "1px solid #dee2e6",
              padding: "15px 20px",
              display: "flex",
              justifyContent: "space-between"
            }}>
              {/* <span style={{color: "#0d6efd", display: "flex", alignItems: "center"}}>
                <span style={{color: "#0d6efd", marginRight: "5px"}}>✓✓</span>
                Mark All As Read
                </span> */}
              <Link to="/Notifications.js">
              <Button style={{
                backgroundColor: "#0d6efd",
                color: "white",
                border: "none",
                borderRadius: "20px",
                padding: "8px 15px"
              }}>
                View All Notifications
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
};

const styles = {
  width: "auto",
  height: "40%",
  padding: "10px 15px",
  marginRight: "10px",
  borderRadius: "10px",
  fontSize: "18px",
  textAlign: "center",
  cursor: "pointer",
  fontFamily: "Futura, sans-serif",
  color: "white",
  transition: "background-color 0.3s ease"
};

export default Home;