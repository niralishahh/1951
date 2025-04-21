import React, { useEffect, useState } from 'react';

function InventoryTable() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5001/api/inventory')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched data:', data);
        setItems(data);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  return (
    <div>
      <h2>Inventory Table</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Category</th>
            <th>Ingredient</th>
            <th>Quantity</th>
            {items[0] && Object.keys(items[0])
              .filter(key => !['category', 'ingredient', 'quantity'].includes(key))
              .map(key => (
                <th key={key}>
                  {key.slice(0, 2)}/{key.slice(2, 4)}/{key.slice(4)}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.category}</td>
              <td>{item.ingredient}</td>
              <td>{item.quantity}</td>
              {Object.entries(item)
                .filter(([key]) => !['category', 'ingredient', 'quantity'].includes(key))
                .map(([key, value]) => (
                  <td key={key}>{value}</td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryTable;
