from flask import Flask, jsonify
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_cors import CORS
from flask import Flask, request

import os
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
CORS(app, origins=["http://localhost:3000"]) # Allow CORS so React can access Flask

@app.route('/')
def home():
    return 'Flask is working!'

@app.route("/api/test-ingredients")
def test_ingredients():
    test_ingredient = ingredientsCollection.find_one()  # Fetch one ingredient
    print("Fetched test ingredient:", test_ingredient)  # Debugging print
    return jsonify(test_ingredient)

@app.route("/api/category-to-ingredients")
def get_ingredients():
    print("Checking ingredients...")  # Debug line
    all_ingredients = list(ingredientsCollection.find())
    print(f"Fetched from DB: {all_ingredients}")  # Debug line to check the raw data
    if not all_ingredients:
        print("No ingredients found in the database.")  # Debug line
    category_map = {}
    for doc in all_ingredients:
        print(f"Document from DB: {doc}")  # Debug line to see each document
        category = doc.get("category")
        ingredient = doc.get("ingredient")
        print(f"Processing ingredient: {ingredient} with category: {category}")  # Debug line
        if category:
            category_map.setdefault(category, []).append(ingredient)

    print(f"Category map: {category_map}")  # Debug line to see the final result
    return jsonify(category_map)

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
        print(f"Received tag for GET request: {tag}")  # 👈 Debugging print

        if not tag:
            return jsonify({"error": "Tag is required"}), 400

        recipes = list(recipesCollection.find({"tags": tag}))
        print(f"Found recipes for tag '{tag}':", recipes)  # 👈 Debugging print

        for recipe in recipes:
            recipe["_id"] = str(recipe["_id"])

        return jsonify(recipes), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)