import React, { useState, useEffect } from "react";
import { Nav, Button } from 'react-bootstrap';
import logo from './logo1951.png';
import { Link, NavLink } from "react-router-dom";

var lastDate;

const Notifications = () => {
  const [currNotifications, setCurrNotifications] = useState([""]);
  const [allNotifications, setAllNotifications] = useState(currNotifications);
  const [loading, setLoading] = useState(false)

    // Fetch all notifications when needed/clicked
    useEffect(() => {
    const fetchNotifications = async () => {
      var topHundred
      //try {
        const response = await fetch('http://127.0.0.1:5000/api/notifications');
        const data = await response.json();
        // if (lastDate !== new Date().toDateString()) {
        //   // do all notification grabbing
        // }
        let extractedWarnings = [];
      
      if (Array.isArray(data)) {
        topHundred = 0
        // Process each MongoDB document
        data.forEach(doc => {
          // Check if doc has warnings array
          if (topHundred < 100 && doc && doc.warnings && Array.isArray(doc.warnings)) {
            // Each element in warnings array is a notification
            //doc.warnings.forEach(warning => {
            //  if (typeof warning === 'string') {
                extractedWarnings.push(doc.warnings[0]);
                topHundred++
            //  }
            //});
          }
        });
      }
      
      if (extractedWarnings.length > 0) {
        setCurrNotifications(extractedWarnings);
      }
        // Check if we already fetched notifications today
        //const lastFetchDate = localStorage.getItem('lastNotificationFetchDate');
        //const today = new Date().toDateString();
        
        // If we've already fetched today, use cached notifications
        // if (lastFetchDate === today) {
        //   const cachedNotifications = JSON.parse(localStorage.getItem('cachedNotifications') || '[]');
        //   setCurrNotifications(cachedNotifications);
        //   setLoading(false);
        //   return;
        // }
        // update to today
        lastDate = new Date().toDateString();
        // If we haven't fetched today, make API call
        //const response = await axios.get('http://localhost:5000/api/notifications');
        //setCurrNotifications(response.data);
        
        // Cache the results and update last fetch date
    //     localStorage.setItem('cachedNotifications', JSON.stringify(response.data));
    //     localStorage.setItem('lastNotificationFetchDate', today);
    //   } catch (err) {
    //     console.error("Error fetching notifications:", err);
        
        // Fallback to sample data in case API is not available during development
        // setCurrNotifications([
        //   { message: "Reminder to order coffee beans", time: "Now" },
        //   { message: "Reminder to order oat milk", time: "1h ago" },
        //   { message: "Reminder to order coffee beans", time: "2h ago" },
        //   { message: "Reminder to order coffee beans", time: "4h ago" }
        // ]);
      // } finally {
      //   setLoading(false);
      // }
    }
    fetchNotifications();
    }, []);

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #dee2e6"
      }}>
        <img src={logo} width="120" height="70" />
        <Nav activeKey="/Notifications.js">
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

export default Notifications;