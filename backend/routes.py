from flask import request, jsonify
from bson import ObjectId
import os
from dotenv import load_dotenv
from pymongo import MongoClient

def initialize_routes(app):
    
    # Load environment and connect to MongoDB
    load_dotenv()
    mongo_uri = os.getenv("URI")
    
    if not mongo_uri:
        raise Exception("MongoDB URI not found in environment variables")
    
    # Connect to MongoDB
    client = MongoClient(mongo_uri)
    db = client['1951Data']
    
    # Get collections
    recipes = db['recipes']
    orderprice = db['order-price']
    inventory = db['inventory']
    ingredients = db['ingredients']

    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        """Simple health check endpoint"""
        return jsonify({
            'status': 'healthy',
            'message': 'Backend is running with MongoDB connection',
            'database': '1951Data',
            'collections': ['recipes', 'order-price', 'inventory', 'ingredients']
        })
    
    # Methods for recipes collection    

    @app.route('/recipes', methods=['POST'])
    def add_recipe():
        data = request.get_json()
        result = recipes.insert_one(data)
        return jsonify({'id' : str(result.inserted_id)})
    
    @app.route('/recipes/<id>', methods=['PUT'])
    def edit_recipe():
        data = request.get_json()
        result = recipes.update_one({"_id" : ObjectId(id)}, {"$set" : data})
        return jsonify({"message" : "Recipe Updated"})
    
    @app.route('/recipes/<id>', methods=['DELETE'])
    def delete_recipe():
        result = recipes.delete_one({'_id' : ObjectId(id)})
        return jsonify({'message' : 'Recipe Deleted'})
    
    # API endpoints for frontend
    @app.route('/api/categories', methods=['GET'])
    def get_categories():
        """Get unique categories from the database"""
        try:
            # Get unique categories from order-price collection
            categories = orderprice.distinct("category")
            return jsonify(categories)
        except Exception as e:
            return jsonify([]), 500
    
    @app.route('/api/ingredients-by-category', methods=['POST'])
    def get_ingredients_by_category():
        """Get ingredients filtered by category"""
        try:
            data = request.get_json()
            category = data.get('category')
            
            if not category:
                return jsonify([]), 400
            
            # Get ingredients for the specific category
            ingredients = orderprice.distinct("ingredient", {"category": category})
            return jsonify(ingredients)
        except Exception as e:
            return jsonify([]), 500
    
    @app.route('/api/ingredient-types', methods=['GET'])
    def get_ingredient_types():
        """Get unique ingredient types from the database"""
        try:
            # Get unique ingredients from order-price collection
            ingredient_types = orderprice.distinct("ingredient")
            return jsonify(ingredient_types)
        except Exception as e:
            return jsonify([]), 500
    
    @app.route('/orderprice/query', methods=['POST'])
    def get_orderprice():
        data = request.get_json()
        
        ingredient_types = data.get('ingredient_types')
        category = data.get('category')
        
        query = {
            "category" : category,
            "ingredient" : {"$in" : ingredient_types}
        }
        
        result = list(orderprice.find(query))
        
        cleaned_result = []
        
        for item in result:
            entry = {
                "_id" : str(item['_id']),
                "ingredient" : item['ingredient'],
                "category" : item['category'],
                "product_name" : item.get("product name", ""),
                "source" : item.get("source", ""),
                "link" : item.get("link", ""),
                "history" : []
            }
            
            for key, val in item.items():
                if key.isdigit() and isinstance(val, list) and len(val) == 2:
                    entry['history'].append({
                        "date" : key,
                        "price" : val[0],
                        "quantity" : val[1]
                    })
                    
            entry['history'].sort(key=lambda x: x['date'])
            cleaned_result.append(entry)
            
        return jsonify(cleaned_result)