from flask import request, jsonify
from bson import ObjectId
from . import db

def initialize_routes(app):
    
    recipes = db['recipes']
    
    inventory = db['inventory']
    ingredients = db['ingredients']

    
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
    
        