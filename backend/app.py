from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for all routes
    CORS(app, origins=["http://localhost:3000"])
    
    # load uri from .env
    load_dotenv()
    mongo_uri = os.getenv("URI")

    # Connect to MongoDB
    if mongo_uri:
        try:
            #connect to cluster
            client = MongoClient(mongo_uri)
            db = client['1951Data']

            #define collections
            ingredientsCollection = db['ingredients']
            recipesCollection = db['recipes']
            inventoryCollection = db['inventory']
            orderpriceCollection = db['order-price']
            
            # Import and register production routes
            from routes import initialize_routes
            initialize_routes(app)
        except Exception as e:
            raise e
    else:
        raise Exception("MongoDB URI not found in .env file")
    
    return app

if __name__ == '__main__':
    app = create_app()
    try:
        app.run(debug=True, port=5000, use_reloader=False)
    except KeyboardInterrupt:
        pass
    except Exception as e:
        print(f"Server error: {e}") 