import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const OrderPriceGraph = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // User selections
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIngredientTypes, setSelectedIngredientTypes] = useState([]);
  const [yAxisType, setYAxisType] = useState('quantity'); // 'quantity' or 'price'
  
  // Available options (will be fetched from database)
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableIngredientTypes, setAvailableIngredientTypes] = useState([]);

  // Backend URL
  const BACKEND_URL = 'http://localhost:5000';

  // Fetch available options on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch ingredients when category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchIngredientsForCategory(selectedCategory);
    } else {
      setAvailableIngredientTypes([]);
      setSelectedIngredientTypes([]);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const categoriesResponse = await fetch(`${BACKEND_URL}/api/categories`);
      
      if (categoriesResponse.ok) {
        const categories = await categoriesResponse.json();
        setAvailableCategories(categories);
      } else {
        console.error('Categories fetch failed:', categoriesResponse.status);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchIngredientsForCategory = async (category) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/ingredients-by-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: category }),
      });
      
      if (response.ok) {
        const ingredients = await response.json();
        setAvailableIngredientTypes(ingredients);
        setSelectedIngredientTypes([]); // Clear previous selections
      } else {
        console.error('Ingredients fetch failed:', response.status);
        setAvailableIngredientTypes([]);
      }
    } catch (err) {
      console.error('Error fetching ingredients for category:', err);
      setAvailableIngredientTypes([]);
    }
  };

  const getChartOptions = () => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Order ${yAxisType === 'quantity' ? 'Quantity' : 'Price'} Over Time`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: yAxisType === 'quantity' ? 'Quantity Ordered' : 'Price ($)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  });

  useEffect(() => {
    if (!selectedCategory || selectedIngredientTypes.length === 0) {
      setData(null);
      return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${BACKEND_URL}/orderprice/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            category: selectedCategory, 
            ingredient_types: selectedIngredientTypes 
          }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Process the data for Chart.js
        const processedData = processDataForChart(result);
        setData(processedData);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, selectedIngredientTypes, yAxisType]);

  const processDataForChart = (apiData) => {
    // Collect all unique dates from the data
    const allDates = new Set();
    
    // Assuming apiData is an array of order records
    apiData.forEach(order => {
      if (order.date) {
        allDates.add(order.date);
      }
    });
    
    // Sort dates chronologically
    const sortedDates = Array.from(allDates).sort();
    
    // Create datasets for each ingredient type
    const datasets = selectedIngredientTypes.map((ingredient, index) => {
      const colors = [
        'rgb(255, 99, 132)',
        'rgb(53, 162, 235)',
        'rgb(75, 192, 192)',
        'rgb(255, 205, 86)',
        'rgb(153, 102, 255)',
        'rgb(255, 159, 64)'
      ];
      
      // Filter data for this ingredient
      const ingredientData = apiData.filter(order => 
        order.ingredient_type === ingredient
      );
      
      // Create data points for each date
      const dataPoints = sortedDates.map(date => {
        const orderForDate = ingredientData.find(order => order.date === date);
        return orderForDate ? orderForDate[yAxisType] : 0;
      });
      
      return {
        label: ingredient,
        data: dataPoints,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length].replace('rgb', 'rgba').replace(')', ', 0.5)'),
        tension: 0.1,
      };
    });
    
    return {
      labels: sortedDates,
      datasets: datasets
    };
  };

  const handleSelectAllIngredients = () => {
    setSelectedIngredientTypes([...availableIngredientTypes]);
  };

  const handleClearAllIngredients = () => {
    setSelectedIngredientTypes([]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Controls Section */}
      <div className="mb-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Analytics Dashboard</h2>
        
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Category:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a category...</option>
            {availableCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Ingredient Types Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Ingredient Types:
          </label>
          <select
            multiple
            value={selectedIngredientTypes}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
              setSelectedIngredientTypes(selectedOptions);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-32"
            size="6"
          >
            {availableIngredientTypes.length === 0 ? (
              <option value="" disabled>
                {selectedCategory ? 'No ingredients found for this category' : 'Please select a category first'}
              </option>
            ) : (
              availableIngredientTypes.map(ingredientType => (
                <option key={ingredientType} value={ingredientType}>
                  {ingredientType}
                </option>
              ))
            )}
          </select>
          <div className="mt-2 flex space-x-2">
            <button
              onClick={handleSelectAllIngredients}
              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
            >
              Select All
            </button>
            <button
              onClick={handleClearAllIngredients}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
            >
              Clear All
            </button>
          </div>
          {selectedIngredientTypes.length > 0 && (
            <div className="mt-2 text-xs text-gray-600">
              Selected: {selectedIngredientTypes.length} ingredient(s)
            </div>
          )}
        </div>

        {/* Y-Axis Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Y-Axis Metric:
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="quantity"
                checked={yAxisType === 'quantity'}
                onChange={(e) => setYAxisType(e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Quantity</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="price"
                checked={yAxisType === 'price'}
                onChange={(e) => setYAxisType(e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Price</span>
            </label>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="border-t pt-6">
        {loading && (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <div className="text-gray-600">Loading chart data...</div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
            <div className="text-red-600">Error loading data: {error}</div>
          </div>
        )}

        {!selectedCategory && (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <div className="text-gray-600">Please select a category to view data</div>
          </div>
        )}

        {selectedCategory && selectedIngredientTypes.length === 0 && (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <div className="text-gray-600">Please select at least one ingredient type</div>
          </div>
        )}

        {data && selectedCategory && selectedIngredientTypes.length > 0 && (
          <div className="w-full h-96">
            <Line options={getChartOptions()} data={data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPriceGraph;
