from flask import Flask
from pymongo import MongoClient
from dotenv import load_dotenv
import os

client = None
db = None
ingredientsCollection = None
recipesCollection = None
pricesCollection = None
inventoryCollection = None
orderCollection = None


def initialize_app():
    
    global client, db
    global ingredientsCollection, recipesCollection, pricesCollection, inventoryCollection, orderCollection
    
    app = Flask(__name__)
    # load uri from .env
    load_dotenv()
    mongo_uri = os.getenv("URI")

    #connect to cluster
    client = MongoClient(mongo_uri)
    db = client['1951-cluster']

    #define collections
    ingredientsCollection = db['ingredients']
    recipesCollection = db['recipes']
    inventoryCollection = db['inventory']
    orderpriceCollection = db['orderprice']
    
    from.routes import initialize_routes
    
    initialize_routes(app)
    
    return app

