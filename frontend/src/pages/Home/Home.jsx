import React from 'react';

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Welcome to Recipe Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage your recipes, inventory, and meal planning all in one place.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recipes</h2>
              <p className="text-gray-600">Create, edit, and manage your favorite recipes.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Inventory</h2>
              <p className="text-gray-600">Track your ingredients and manage stock levels.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Planning</h2>
              <p className="text-gray-600">Plan meals and get alerts for low inventory.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 