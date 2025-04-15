const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb+srv://cfg1951sp25:DSGFyLjehdqB5hle@1951-cluster.nuzzx.mongodb.net/?retryWrites=true&w=majority&appName=1951-cluster"

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//recipe id given --> returns specific recipe, else all returned
async function getRecipes(recipeId) {
  try {
    
    await client.connect();

    const database = client.db("1951Data"); 
    const recipes = database.collection("recipes"); 

    let result;
    if (recipeId) {
    
      result = await recipes.findOne({ _id: new ObjectId(recipeId) });
    } else {
      result = await recipes.find({}).toArray();
    }
    return result;
  } catch (error) {
    console.error("Error retrieving recipes:", error);
    throw error;
  } finally {
    await client.close();
  }
}

// Example usage:
(async () => {
  try {
    // specific recipe
    const recipeId = "67f5cfbb240909d84d0353df";
    const specificRecipe = await getRecipes(recipeId);
    console.log("Recipe with ID:", specificRecipe);
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
