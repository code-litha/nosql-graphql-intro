require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

const url = process.env.MONGODB_URI;
// console.log(url, "<<< url");

const client = new MongoClient(url);

// Database Name
const dbName = "db_bsd_11";

async function mongoConnect() {
  try {
    // Use connect method to connect to the server
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const productCollection = db.collection("products");

    // const product = await productCollection.findOne({
    //   // _id: new ObjectId("65dc382f4654cd18a9cd6f5d"),
    //   _id: new ObjectId("65dc382f4654cd18a9cd6f5d"),
    // });
    // console.log(product, "<<< product");
    // the following code examples can be pasted here...

    const newProduct = await productCollection.insertOne({
      name: "Jacket 4",
      price: 100000,
      stock: 5,
    });

    console.log(newProduct, "<<< new product");

    const product = await productCollection.findOne({
      _id: new ObjectId(newProduct.insertedId),
    });

    console.log(product, "<<< product yang di findOne lagi sama rio");
    return "done.";
  } catch (error) {
    console.log(error, "<<< error");
    throw error;
  }
}

mongoConnect();
