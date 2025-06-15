# 1951/backend/__init__.py

from flask import Flask, jsonify, request
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_cors import CORS
import os
from bson.objectid import ObjectId
from datetime import datetime
import traceback


# load uri from .env
load_dotenv()
mongo_uri = os.getenv("URI")
print("Mongo URI:", mongo_uri)

#connect to cluster
client = MongoClient(mongo_uri)
db = client['1951Data']

#define collections
ingredientsCollection = db['ingredients'] 
recipesCollection = db['recipes'] 
inventoryCollection = db['inventory'] 
ordersCollection = db['orders']
order_pricesCollection = db['order-price'] 

print("Collections in DB:", db.list_collection_names())
print("Databases in MongoDB:", client.list_database_names())
print("Collections in 1951-cluster:", db.list_collection_names())

print("Testing DB connection...")
try:
    client.admin.command('ismaster')
    print("DB connection successful!")
except Exception as e:
    print(f"DB connection failed: {e}")

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"]) 

@app.route('/')
def home():
    return 'Flask is working!'

@app.route("/api/test-ingredients")
def test_ingredients():
    test_ingredient = ingredientsCollection.find_one()  
    print("Fetched test ingredient:", test_ingredient)  
    return jsonify(test_ingredient)

@app.route("/api/category-to-ingredients")
def get_ingredients():
    print("Checking ingredients...") 
    all_ingredients = list(ingredientsCollection.find())
    print(f"Fetched from DB: {all_ingredients}")  
    if not all_ingredients:
        print("No ingredients found in the database.")  
    category_map = {}
    for doc in all_ingredients:
        print(f"Document from DB: {doc}")  
        category = doc.get("category")
        ingredient = doc.get("ingredient")
        print(f"Processing ingredient: {ingredient} with category: {category}") 
        if category:
            category_map.setdefault(category, []).append(ingredient)

    print(f"Category map: {category_map}") 
    return jsonify(category_map)

# Endpoint to fetch items from order-price with source="Amazon"
@app.route("/api/amazon-items", methods=["GET"])
def get_amazon_items():
    print("Fetching Amazon items from order-price...")
    try:
        # Query the order-price collection for items with source="Amazon"
        # Ensure 'ingredient' and 'category' fields are present, as the frontend uses them
        amazon_items = list(order_pricesCollection.find({"source": "Amazon"}, {"ingredient": 1, "category": 1, "_id": 1}))
        # Convert ObjectId to string for JSON serialization
        for item in amazon_items:
            item["_id"] = str(item["_id"])
        print(f"Found {len(amazon_items)} Amazon items with source 'Amazon'.")
        return jsonify(amazon_items), 200
    except Exception as e:
        print(f"Error fetching Amazon items from order-price: {e}")
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch Amazon items", "details": str(e)}), 500


# Modified endpoint to save Amazon order data by updating all documents
@app.route("/api/amazon-orders", methods=["POST"])
def add_amazon_order():
    data = request.get_json()
    print("Received Amazon order data:", data)

    if not data or not data.get("date") or not data.get("quantities"):
        print("Validation failed: Missing date or quantities.")
        return jsonify({"error": "Missing 'date' or 'quantities'"}), 400

    order_date_str = data["date"] # e.g., "2025-04-28"
    submitted_quantities = data["quantities"] # e.g., {"Rose water": 3, "Chia seeds": 0, ...}

    # Format the date string to mmddyyyy
    try:
        date_obj = datetime.strptime(order_date_str, '%Y-%m-%d')
        formatted_date_field = date_obj.strftime('%m%d%Y') # e.g., "04282025"
        print(f"Formatted date field name for update: {formatted_date_field}")
    except ValueError as e:
        print(f"Date formatting error: {e}")
        traceback.print_exc()
        return jsonify({"error": "Invalid date format. Expected YYYY-MM-DD.", "details": str(e)}), 400
    except Exception as e:
         print(f"Unexpected error during date formatting: {e}")
         traceback.print_exc()
         return jsonify({"error": "Unexpected date processing error", "details": str(e)}), 500

    # --- Logic to update ALL documents in order-price ---
    # Fetch all documents to iterate and decide the update for each
    all_items_cursor = order_pricesCollection.find({})
    total_items = order_pricesCollection.count_documents({})
    print(f"Attempting to update {total_items} documents in order-price collection.")

    success_count = 0 # Count of documents that the update_one call matched (found)
    modified_total_count = 0 # Count of documents that were actually modified
    errors_list = []
    processed_count = 0

    # Use a bulk operation for potentially better performance if many items
    # However, for clarity and simpler logic flow (getting existing price),
    # we'll stick to update_one in a loop for now.
    # For performance, consider fetching all items once, building a list of updates,
    # and then using bulk_write or update_many. But given the current requirement
    # to potentially preserve the existing price, reading first is needed.

    try:
        # Iterate through ALL documents in the order-price collection
        for item_doc in all_items_cursor:
            processed_count += 1
            item_name = item_doc.get("ingredient")
            item_id = item_doc.get("_id")

            if not item_name:
                 errors_list.append(f"Skipped document with no ingredient field (ID: {item_id})")
                 continue

            # Get the current value for the date field, if it exists
            # Default to [0, 0.00] if the field doesn't exist yet
            current_value_for_date = item_doc.get(formatted_date_field, [0, 0.00])
            current_price = current_value_for_date[1] # Get the existing price

            # Determine the NEW quantity based on whether it was submitted
            if item_name in submitted_quantities:
                # Use the quantity from the form for submitted items
                quantity_value = submitted_quantities[item_name]
                try:
                    new_quantity = int(quantity_value)
                    print(f"\nProcessing {processed_count}/{total_items}: Submitted item '{item_name}'. New quantity: {new_quantity}. Keeping price: {current_price}")
                except ValueError:
                    # Handle invalid quantity format for submitted item
                    errors_list.append(f"Invalid quantity format for submitted item '{item_name}': {quantity_value}. Defaulting quantity to 0.")
                    new_quantity = 0
                    print(f"\nProcessing {processed_count}/{total_items}: Submitted item '{item_name}' had invalid quantity. Defaulting quantity to 0. Keeping price: {current_price}")
            else:
                # For items not submitted in the form, the quantity for this date is 0
                new_quantity = 0
                print(f"\nProcessing {processed_count}/{total_items}: Non-submitted item '{item_name}'. New quantity: 0. Keeping price: {current_price}")

            # Construct the new value for the date field [quantity, price]
            value_to_set = [new_quantity, current_price]

            # Perform the update operation for the current document
            # We are using $set to add the new field or update its value if it exists.
            update_operation = {"$set": {formatted_date_field: value_to_set}}

            # print(f"Update query: {{'_id': ObjectId('{item_id}')}}") # Only print if needed for deep debug
            # print(f"Update operation: {update_operation}") # Only print if needed for deep debug

            result = order_pricesCollection.update_one(
                {"_id": item_id}, # Query by ObjectId
                update_operation,
                upsert=False # Ensure we only update existing documents
            )

            # print(f"MongoDB update result for '{item_name}': Matched={result.matched_count}, Modified={result.modified_count}") # Only print if needed

            if result.matched_count > 0:
                 success_count += 1 # Count documents we attempted to update (found)
                 modified_total_count += result.modified_count # Count documents that were actually changed
                 # print(f"'{item_name}' matched and processed.") # Only print if needed
            else:
                 # Should not happen if iterating a cursor unless doc was deleted
                 errors_list.append(f"Ingredient '{item_name}' (ID: {item_id}) not found during update (document might have been deleted).")


    except Exception as e:
        # Catch any errors during the iteration or database interaction
        error_message = f"An error occurred during order processing: {e}"
        print(error_message)
        errors_list.append(error_message)
        traceback.print_exc()


    print(f"\nFinished processing order. Total documents in collection: {total_items}. Documents processed: {processed_count}. Documents matched/attempted update: {success_count}. Documents actually modified: {modified_total_count}. Errors: {len(errors_list)}")

    # Determine the overall response status
    if not errors_list:
        # All documents processed without errors within the loop.
        return jsonify({"message": f"Order data for {formatted_date_field} processed for all items. {modified_total_count} documents modified."}), 201
    else:
        # Some errors or skips occurred.
        status_code = 500 if processed_count == 0 or any("An error occurred during order processing" in err for err in errors_list) else 207
        return jsonify({
            "message": f"Order processing completed with issues for {formatted_date_field}.",
            "documents_matched": success_count, # How many docs the update_one query found
            "documents_modified": modified_total_count, # How many docs were actually changed
            "errors": errors_list
            }), status_code


@app.route("/api/recipes", methods=["GET", "POST"])
def handle_recipes():
    if request.method == "POST":
        data = request.get_json()
        print("Received recipe:", data)

        if not data or not data.get("title") or not data.get("ingredients"):
            return jsonify({"error": "Missing 'title' or 'ingredients'"}), 400

        new_recipe = {
            "title": data["title"],
            "ingredients": data["ingredients"],
            "tags": data.get("tags", "")
        }
        recipesCollection.insert_one(new_recipe)
        return jsonify({"message": "Recipe added successfully"}), 201

    elif request.method == "GET":
        tag = request.args.get("tags")
        print(f"Received tag for GET request: {tag}") 

        if not tag:
            return jsonify({"error": "Tag is required"}), 400

        recipes = list(recipesCollection.find({"tags": tag}))
        print(f"Found recipes for tag '{tag}':", recipes)  

        for recipe in recipes:
            recipe["_id"] = str(recipe["_id"])

        return jsonify(recipes), 200

@app.route("/api/recipes/<recipe_id>", methods=["GET"])
def get_recipe_by_id(recipe_id):
    try:
        recipe = recipesCollection.find_one({"_id": ObjectId(recipe_id)})
        if not recipe:
            return jsonify({"error": "Recipe not found"}), 404

        # Convert ObjectId to string
        recipe["_id"] = str(recipe["_id"])
        return jsonify(recipe), 200
    except Exception as e:
        print(f"Error fetching recipe by ID: {e}")
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch recipe", "details": str(e)}), 500


@app.route('/recipes', methods=['POST'])
def add_recipe():
    data = request.get_json()
    result = recipesCollection.insert_one(data)
    return jsonify({'id': str(result.inserted_id)})

@app.route('/recipes/<id>', methods=['PUT'])
def edit_recipe(id):
    data = request.get_json()
    result = recipesCollection.update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"message": "Recipe Updated"})

@app.route('/recipes/<id>', methods=['DELETE'])
def delete_recipe(id):
    result = recipesCollection.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'Recipe Deleted'})

@app.route("/api/recipes", methods=["PUT"])
def update_recipe():
    recipe_data = request.get_json()
    
  
    recipe_id = recipe_data['id'] 
    recipe = db.get_recipe_by_id(recipe_id) 
    if recipe:
        updated_recipe = db.update_recipe(recipe_id, recipe_data) 
        return jsonify(updated_recipe), 200
    else:
        return jsonify({"error": "Recipe not found"}), 404

from flask import abort

@app.route("/api/recipes/<recipe_id>/ingredients/<int:ingredient_index>", methods=["DELETE"])
def delete_ingredient_by_index(recipe_id, ingredient_index):
    try:
        recipe = recipesCollection.find_one({"_id": ObjectId(recipe_id)})
        if not recipe:
            return jsonify({"error": "Recipe not found"}), 404

        ingredients = recipe.get("ingredients", [])

        print(f"Recipe ID: {recipe_id} has {len(ingredients)} ingredients.")
        print(f"Requested ingredient index to delete: {ingredient_index}")


        if ingredient_index < 0 or ingredient_index >= len(ingredients):
    return jsonify({
        "error": "Ingredient index out of range",
        "ingredient_index": ingredient_index,
        "ingredients_length": len(ingredients)
    }), 400

        ingredients.pop(ingredient_index)
        recipesCollection.update_one({"_id": ObjectId(recipe_id)}, {"$set": {"ingredients": ingredients}})

        return jsonify({"message": "Ingredient deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting ingredient: {e}")
        traceback.print_exc()
        return jsonify({"error": "Failed to delete ingredient", "details": str(e)}), 500
    
if __name__ == "__main__":
    app.run(debug=True, port=5000)