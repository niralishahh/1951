import React, { useState } from "react";
import RecipeCard from "../../components/recipeCard";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";

const recipes = [
  //test recipes
  { id: 1, title: "Pancakes", description: "Fluffy pancakes made with fresh eggs, milk, and a touch of vanilla. Served with maple syrup and a side of fresh fruit for a delightful breakfast experience that everyone will love." },
  { id: 2, title: "Omelette", description: "A classic cheese omelette with a golden exterior and a soft, creamy center. Perfect for a quick breakfast or brunch, filled with your choice of vegetables and herbs." },
  { id: 3, title: "Pizza", description: "Cheese pizza with a crispy crust, tangy tomato sauce, and a generous layer of melted mozzarella. Ideal for sharing with friends and family on a cozy night in." },
  { id: 4, title: "Salad", description: "Fresh salad made with crisp lettuce, juicy tomatoes, cucumbers, and a light vinaigrette. A healthy and refreshing option for lunch or dinner, packed with nutrients." },
  { id: 5, title: "Soup", description: "Hot soup simmered to perfection with seasonal vegetables, aromatic herbs, and a savory broth. Comforting and nourishing, great for chilly days or when you need a pick-me-up." },
  { id: 6, title: "Sandwich", description: "Cheese sandwich layered with slices of cheddar, fresh lettuce, and ripe tomatoes, all nestled between two slices of toasted bread. A satisfying meal for any time of day." },
  { id: 7, title: "Burger", description: "Juicy cheese burger with a perfectly grilled patty, melted cheese, crisp lettuce, and a soft bun. Served with a side of fries for the ultimate comfort food experience." },
  { id: 8, title: "Pasta", description: "Cheese pasta tossed in a creamy sauce with hints of garlic and parmesan. Topped with fresh herbs and served hot for a delicious and filling dinner option." },
  { id: 9, title: "Rice", description: "Cheese rice cooked with aromatic spices, vegetables, and a blend of cheeses. A flavorful and hearty dish that can be enjoyed on its own or as a side." },
  // Add more recipes as needed
];

export default function Recipes() {
    const [activeTab, setActiveTab] = useState('All');
    const tabs = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert'];
    

    
    const handleView = (id) => {
        console.log(`Viewing recipe with ID: ${id}`);
    }

    const handleDelete = (id) => {
        console.log(`Deleting recipe with ID: ${id}`);
    }

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-stretch p-1 rounded-lg">
            <div className="flex space-x-2 mb-2 sm:mb-0">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-gray-50 border border-black'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="sm:ml-auto flex space-x-2">
              <button className="px-4 py-2 rounded-md text-white bg-black text-sm font-medium hover:bg-gray-900 transition-colors flex items-center">
                Add New Ingredient
                <Plus size={16} className="ml-2" />
              </button>
              <button className="px-4 py-2 rounded-md text-white bg-black text-sm font-medium hover:bg-gray-900 transition-colors flex items-center">
                Add New Recipe
                <Plus size={16} className="ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{activeTab}</h1>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              title={recipe.title}
              description={recipe.description}
              onView={() => handleView(recipe.id)}
              onDelete={() => handleDelete(recipe.id)}
            />
          ))}
        </div>
      </div>
    )
}