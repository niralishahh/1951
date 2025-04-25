import React, { useState, useEffect } from "react";
import { Nav, Button } from 'react-bootstrap';
import logo from './Screenshot 2025-04-15 at 7.01.33 PM.png';
import { Link, NavLink } from "react-router-dom";

var lastDate;

const Home = () => {
  const [currNotifications, setCurrNotifications] = useState([""]);
  const [allNotifications, setAllNotifications] = useState(currNotifications);
  const [loading, setLoading] = useState(false)

    // Fetch notifications once daily, try to cache if possible
    useEffect(() => {
      const fetchNotifications = async () => {
        // Check if we already fetched notifications today
        const today = new Date().toDateString();
        
        // If we've already fetched today and have data, don't fetch again
        if (lastDate === today && currNotifications.length > 1) {
          return;
        }
        
        var topFew = 0;
        try {
          const response = await fetch('http://127.0.0.1:5000/api/updatenotifications');
          const data = await response.json();
          let extractedWarnings = [];
          
          if (Array.isArray(data)) {
            // Process each MongoDB document
            data.forEach(doc => {
              // Check if doc has warnings array
              if (topFew < 7 && doc && doc.warnings && Array.isArray(doc.warnings)) {
                extractedWarnings.push(doc.warnings[1]);
                topFew++;
              }
            });
          }
          
          if (extractedWarnings.length > 0) {
            setCurrNotifications(extractedWarnings);
          }
          
          // Update the last fetch date
          lastDate = today;
          
          // Store in localStorage for persistence across sessions
          localStorage.setItem('lastNotificationFetchDate', today);
          localStorage.setItem('cachedNotifications', JSON.stringify(extractedWarnings));
        } catch (err) {
          console.error("Error fetching notifications:", err);
          
          // Try to load from cache if available
          const cachedNotifications = JSON.parse(localStorage.getItem('cachedNotifications') || '[]');
          if (cachedNotifications.length > 0) {
            setCurrNotifications(cachedNotifications);
          }
        }
      };
    
      // Set up a daily check
      fetchNotifications();
      
      // Check once a day (set timer to check every hour if date has changed)
      const intervalId = setInterval(() => {
        const today = new Date().toDateString();
        if (lastDate !== today) {
          fetchNotifications();
        }
      }, 43200000); // Check every 12 hours (43200000 ms)
      
      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    }, []); // Still empty dependency array since we manage updates manually

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
      
      <div style={{display: "flex", padding: "20px", justifyContent: "space-evenly"}}>
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