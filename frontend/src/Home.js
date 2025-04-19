import React, { useState } from "react";
import {Nav, Button} from 'react-bootstrap';

const Home = () => {
  const [notifications, setNotifications] = useState(["Go get some milk", "how's life"]);

  return (
    <div>
        <div style={{display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          padding: "10px 20px",
          borderBottom: "1px solid #dee2e6"}}>
            <img src={"/Screenshot 2025-04-15 at 7.01.33 PM.png"} width="120" height="60"/>
            <Nav activeKey="/Home.js">
                <Nav.Item>
                    <Nav.Link href="/Home.js">Home</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/Inventory.js">Inventory</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/RecipesMain.js">Recipes</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/Notifications.js">Notifications</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
        <div style={{display: "flex", padding: "20px", justifyContent: "space-evenly"}}>
            <Button style={styles} variant="dark">Update Order History ⊕</Button>
            <Button style={styles} variant="dark">View Data Table  ⊕</Button>
            <div style={{ 
            flex: "1 1 400px", 
            border: "1px solid #d3d3d3", 
            padding: "20px",
            borderRadius: "20px", 
            overflow: "hidden",
            textAlign: "left"
            }}>
                <h2>Notifications ({notifications.length})</h2>
                <ul>
                    {notifications.map((notification) => (
                        <li key={notification.id} style={{ 
                         borderTop: "2px solid #dee2e6",
                         borderBottom: "2px solid #dee2e6", 
                         padding: "10px",
                         marginBottom: "5px",
                         display: "flex",
                         justifyContent: "space-between"}}>
                         {notification}
                         </li>))}
                     <li>
                        <Button style={{marginRight: "20px"}}>Mark All as Read</Button>
                        <Button>View All Notifications</Button>
                     </li>
                </ul>
            </div>
        </div>
    </div>
  );
};

const styles = {
  width: "20%",
  height: "40%",
  padding: "10px",
  marginRight:"10px",
  borderRadius: "10px",
  fontSize: "19px",
  textAlign: "center",
  cursor: "pointer",
  fontFamily: "Futura, sans-serif",
  color: "white",
  transition: "background-color 0.3s ease" 
};

export default Home;

