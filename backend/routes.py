from flask import request, jsonify
from bson import ObjectId
from . import db

def initialize_routes(app):
    
    recipes = db['recipes']
    orderprice = db['orderprice']
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