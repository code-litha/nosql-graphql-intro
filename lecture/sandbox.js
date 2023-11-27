require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

// Replace the uri string with your connection string.
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);
const dbName = "db_bsd_08";

async function run() {
  try {
    await client.connect();
    console.log("Successfully to connect mongodb");

    const database = client.db(dbName);
    const productCollection = database.collection("products");

    const products = await productCollection.find({}).toArray();
    console.log(products, "<<< products");

    const product = await productCollection.findOne({
      _id: new ObjectId("656436bcb90fa600317d5bad"),
    });
    console.log(product);

    // const newProducts = await productCollection.insertMany([
    //   { name: "baju", stock: 10, price: 20000 },
    //   { name: "celana", stock: 10, price: 20000 },
    // ]);
    // console.log(newProducts);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run();
