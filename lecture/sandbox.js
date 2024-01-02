require("dotenv").config();

const { MongoClient, ObjectId } = require("mongodb");

// Replace the uri string with your connection string.
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

async function mongoConnect() {
  try {
    await client.connect();
    console.log(`Successfully connect to mongo`);
    const database = client.db("db_bsd_09");
    const productCollection = database.collection("products");

    const product = await productCollection.findOne({
      _id: new ObjectId("6593b619f9ef0595bdb0bdc3"),
    });

    console.log(product, "<<< product");

    // Find all
    // const products = await productCollection.find().toArray();
    // console.log(products);
  } catch (error) {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log(`Error while connect to mongo`);
  }
}

mongoConnect();
