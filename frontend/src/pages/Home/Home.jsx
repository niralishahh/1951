import React, { useState } from 'react';

export default function GraphCreationUI() {
  const [category, setCategory] = useState('Milk');
  const [types, setTypes] = useState(['Milk']);
  const [quantity, setQuantity] = useState(12);
  const [showPriceChanges, setShowPriceChanges] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      {/* Checkboxes */}
      <div className="flex space-x-10 mb-6">
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={showPriceChanges} onChange={() => setShowPriceChanges(!showPriceChanges)} />
          <span className="text-lg font-medium">Price Changes</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={showOrderHistory} onChange={() => setShowOrderHistory(!showOrderHistory)} />
          <span className="text-lg font-medium">Order History</span>
        </label>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        <div>
          <label className="block mb-2 font-semibold text-lg">Ingredient Category:</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border rounded-md p-2 bg-gray-100">
            <option value="Milk">Milk</option>
            <option value="Syrup">Syrup</option>
            <option value="Beans">Beans</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-lg">Ingredient Type:</label>
          <select value={types[0]} onChange={e => setTypes([e.target.value])} className="w-full border rounded-md p-2 bg-gray-100">
            <option value="Milk">Milk</option>
            <option value="Almond Milk">Almond Milk</option>
            <option value="Oat Milk">Oat Milk</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-lg">Order Quantity: — units</label>
          <div className="flex items-center space-x-2">
            <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="flex-1 border rounded-md p-2 bg-gray-100" />
            <span className="text-lg">oz</span>
          </div>
        </div>
      </div>

      {/* Placeholder Graphs */}
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-gray-100 h-80 rounded-lg" />
        <div className="bg-gray-100 h-80 rounded-lg" />
      </div>
    </div>
  );
}
