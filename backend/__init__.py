from flask import Flask, jsonify
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_cors import CORS
import os

# Load URI from .env
load_dotenv()
mongo_uri = os.getenv("URI")

# Connect to MongoDB
client = MongoClient(mongo_uri)
db = client['1951Data']

# Define collections
ingredientsCollection = db['ingredients']
recipesCollection = db['recipes']
pricesCollection = db['prices']
inventoryCollection = db['inventory']

# Create Flask app
app = Flask(__name__)
CORS(app)  # ✅ THIS MUST COME AFTER app = Flask(__name__)

@app.route("/api/inventory")
def get_inventory():
    data = list(inventoryCollection.find({}, {"_id": 0}))  # remove _id field
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True, port=5001)

