from flask import Flask, request, jsonify
import certifi
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# load uri from .env
load_dotenv()
mongo_uri = os.getenv("URI")

app = Flask(__name__)

#connect to cluster
client = MongoClient(mongo_uri, ssl=True, tlsCAFile=certifi.where(), tls = True, tlsAllowInvalidCertificates=True)


db = client['1951Data']

#define collections
ingredientsCollection = db['ingredients']
recipesCollection = db['recipes']
inventoryCollection = db['inventory']

@app.route("/")
def home():
    return "Flask + MongoDB server is running!"

@app.route('/add', methods=['POST'])
def add_ingredient():
    """
    Inserts an ingredient into the ingredient db:

    - "name"
    - "category"

    """
    name = request.json['name']
    category = request.json['category']
    print("POST /add hit!")
    recipe_unit = "units"
    if category == "liquids":
        recipe_unit = "oz"
    elif category == "syrups" or category == "ingredients":
        recipe_unit = "grams"
    elif category == "bottled drinks":
        recipe_unit = "bottle"
    
    ingredient_doc = { 'ingredient' : name, 'category' : category, 'recipe unit': recipe_unit, 'link': 'n/a', 'source': 'n/a'}

    print(ingredient_doc)

    try:
        result = ingredientsCollection.insert_one(ingredient_doc)
        print("Inserted ID:", result.inserted_id)
    except Exception as e:
        print("Mongo insert failed:", e)

    return {"status": "success"}

if __name__ == "__main__":
    app.run(debug=True)
    # add_ingredient('whole milk', 'liquids')