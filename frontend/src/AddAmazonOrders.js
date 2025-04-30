// 1951/frontend/src/AddAmazonOrders.js
import React, { useState, useEffect } from 'react';
import './App.css'; // Assuming you want to use App.css for general styles or fonts

// Define styles similar to those in AddIngredientPopup.js or App.css
const pageContainerStyles = {
    padding: '30px',
    fontFamily: 'Futura, sans-serif',
    color: 'black',
    backgroundColor: '#fff',
    minHeight: '100vh',
    maxWidth: '600px', // Limit width for better readability
    margin: '0 auto', // Center the content
    boxSizing: 'border-box', // Include padding in width
    position: 'relative', // Needed for positioning absolute close button
};

const headerStyles = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '30px',
    textAlign: 'left',
};

const dateInputContainerStyles = {
    marginBottom: '30px',
    textAlign: 'left',
};

const labelStyles = {
    display: 'block',
    fontSize: '16px',
    marginBottom: '5px',
    fontWeight: 'bold', // Make labels bold as in the image
};

const textInputStyles = {
    width: '100%',
    padding: '10px 15px',
    marginTop: '5px',
    borderRadius: '5px',
    border: '1px solid transparent', // Match the style
    backgroundColor: '#F5F1F1', // Match the style
    fontFamily: 'Futura, sans-serif',
    fontSize: '16px',
    boxSizing: 'border-box', // Include padding in width
};

const categoryHeaderStyles = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginTop: '25px',
    marginBottom: '15px',
    textAlign: 'left',
};

const itemRowStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee', // Separator line like the image
    flexWrap: 'wrap', // Allow wrapping on small screens
};

const itemLabelStyles = {
    fontSize: '16px',
    flex: '1 1 150px', // Allow label to grow but have a min-width
    marginRight: '20px', // Space between label and input
    textAlign: 'left',
};

const quantityInputContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    flex: '0 0 150px', // Fixed width for input area, or adjust as needed
    position: 'relative',
    backgroundColor: '#F5F1F1', // Match the style
    borderRadius: '5px',
    padding: '10px 15px',
    boxSizing: 'border-box', // Include padding in width
};

const quantityInputStyles = {
    flexGrow: 1, // Input takes available space
    border: 'none', // Remove input border
    backgroundColor: 'transparent', // Transparent background
    fontFamily: 'Futura, sans-serif',
    fontSize: '16px',
    outline: 'none', // Remove outline on focus
    // Hide number input arrows
    '-moz-appearance': 'textfield',
    '::-webkit-outer-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0,
    },
    '::-webkit-inner-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0,
    },
    paddingRight: '40px', // Make space for the unit label
};

const unitStyles = {
    position: 'absolute',
    right: '15px', // Position from the right edge of the container
    fontSize: '14px',
    color: '#555', // Slightly muted color
    pointerEvents: 'none', // Allow clicks to pass through to the input
};


const submitButtonStyles = {
    backgroundColor: 'black',
    color: 'white',
    padding: '12px 25px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '30px',
    marginBottom: '20px',
    display: 'block', // Make button a block element
    width: '100%', // Full width button
    fontFamily: 'Futura, sans-serif',
};

const AddAmazonOrders = ({ onClose }) => {
    const [date, setDate] = useState('');
    const [quantities, setQuantities] = useState({});
    const [amazonItemsByCategory, setAmazonItemsByCategory] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitMessage, setSubmitMessage] = useState('');

    useEffect(() => {
        const fetchAmazonItems = async () => {
            try {
                // ** UPDATED FETCH URL **
                const response = await fetch('http://127.0.0.1:5000/api/amazon-items');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                const itemsByCategory = {};
                const initialQuantities = {};
                data.forEach(item => {
                    // Assuming 'category' and 'ingredient' fields exist in order_prices docs
                    const category = item.category || 'Other';
                    if (!itemsByCategory[category]) {
                        itemsByCategory[category] = [];
                    }
                    itemsByCategory[category].push(item);
                    initialQuantities[item.ingredient] = ''; // Initialize quantity
                });

                setAmazonItemsByCategory(itemsByCategory);
                setQuantities(initialQuantities);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching Amazon items:", err);
                setError("Failed to load items.");
                setLoading(false);
            }
        };

        fetchAmazonItems();
    }, []);

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    const handleQuantityChange = (itemName, value) => {
        // Allow only digits and handle empty string
        const numericValue = value === '' ? '' : parseInt(value, 10);

        if (value === '' || (!isNaN(numericValue) && numericValue >= 0)) {
             setQuantities(prevQuantities => ({
                ...prevQuantities,
                [itemName]: value // Store the string value
             }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitMessage('');

        if (!date) {
            setSubmitMessage('Please select a date.');
            return;
        }

        // Prepare data: Convert quantities from string input to numbers.
        // Empty strings or invalid numbers will become 0.
        const quantitiesToSend = Object.keys(quantities).reduce((acc, itemName) => {
             const value = quantities[itemName];
             const numericValue = value === '' ? 0 : parseInt(value, 10);
             // Include all Amazon items in the quantities object,
             // backend will handle which ones to update based on ingredient name
             acc[itemName] = isNaN(numericValue) ? 0 : numericValue;
             return acc;
        }, {});


        const orderData = {
            date: date, // Send the YYYY-MM-DD date string
            quantities: quantitiesToSend, // Send the { item_name: quantity } map
        };

        try {
            // ** UPDATED FETCH URL **
            const response = await fetch('http://127.0.0.1:5000/api/amazon-orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

             const result = await response.json();

            if (response.ok) {
                console.log('Order saved:', result);
                setSubmitMessage(result.message || 'Order added successfully!');
                // Clear the form after successful submission
                setDate('');
                const initialQuantities = {};
                 Object.keys(amazonItemsByCategory).forEach(category => {
                    amazonItemsByCategory[category].forEach(item => {
                         initialQuantities[item.ingredient] = '';
                    });
                 });
                setQuantities(initialQuantities);

            } else {
                console.error('Failed to save order:', result);
                 // Display specific backend error message if available
                setSubmitMessage(`Error: ${result.message || result.error || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('Error submitting order:', err);
            setSubmitMessage(`Error submitting order: ${err.message}`);
        }
    };

    return (
        <div style={pageContainerStyles}>
             <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: 'black',
                }}
                aria-label="Close"
            >
                ×
            </button>

            <h1 style={headerStyles}>Add Order Amount</h1>

            <form onSubmit={handleSubmit}>
                {/* Date Input */}
                <div style={dateInputContainerStyles}>
                    <label style={labelStyles} htmlFor="order-date">Date</label>
                    <input
                        type="date" // Use type="date" for date picker
                        id="order-date"
                        value={date}
                        onChange={handleDateChange}
                        style={textInputStyles}
                        required
                    />
                </div>

                {/* Loading/Error State */}
                {loading && <p>Loading items...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {/* Item Quantity Inputs (grouped by category) */}
                {!loading && !error && Object.keys(amazonItemsByCategory).length > 0 && (
                    Object.entries(amazonItemsByCategory).map(([category, items]) => (
                        <div key={category}>
                            <h3 style={categoryHeaderStyles}>Category: {category}</h3>
                            {items.map(item => (
                                <div key={item._id} style={itemRowStyles}>
                                     {/* Use item.ingredient as the label text */}
                                    <span style={itemLabelStyles}>{item.ingredient}</span>
                                    <div style={quantityInputContainerStyles}>
                                        <input
                                            type="text" // Use type="text" to allow placeholder when empty
                                            placeholder="Enter Quantity"
                                            value={quantities[item.ingredient] || ''} // Ensure value is never null/undefined for controlled input
                                            onChange={(e) => handleQuantityChange(item.ingredient, e.target.value)}
                                            style={quantityInputStyles}
                                        />
                                        <span style={unitStyles}>case(s)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}

                 {!loading && !error && Object.keys(amazonItemsByCategory).length === 0 && (
                     <p>No Amazon items found in the order_prices database.</p>
                 )}

                {/* Submit Button */}
                {!loading && !error && Object.keys(amazonItemsByCategory).length > 0 && (
                    <button type="submit" style={submitButtonStyles}>
                        Submit
                    </button>
                 )}

                {/* Submission Message */}
                {submitMessage && (
                    <p style={{ color: submitMessage.includes('success') ? 'green' : (submitMessage.includes('Error') || submitMessage.includes('Failed') ? 'red' : 'black'), textAlign: 'center', marginTop: '20px' }}>
                        {submitMessage}
                    </p>
                )}
            </form>
        </div>
    );
};

export default AddAmazonOrders;