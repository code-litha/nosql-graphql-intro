require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

// Replace the uri string with your connection string.
const uri = process.env.MONGODB_URL;

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Successfully to connect mongodb");
    const database = client.db("db_ecommerce");
    const productCollections = database.collection("movies");

    //--- Find All
    const products = await productCollections.find().toArray();
    console.log(products);

    // //--- Insert One
    // const newProduct = await productCollections.insertOne({
    //   name: "Shirt 2",
    //   price: 2e6,
    //   stock: 30,
    //   mainImgUrl:
    //     "https://i.pinimg.com/originals/f7/1c/5c/f71c5c1e89dbb27a7e840b6fb60932eb.png",
    // });
    // console.log(newProduct);

    // //--- Find One
    // const product = await productCollections.findOne({
    //   _id: new ObjectId("6563628b170fa3cee3da635d"),
    // });
    // console.log(product);

    // //--- Update One
    // const updateProduct = await productCollections.updateOne(
    //   {
    //     _id: new ObjectId("6563628b170fa3cee3da635d"),
    //   },
    //   {
    //     $set: {
    //       // $set => jika ingin melakukan update ke dalam field tertentu atau membuat field baru
    //       description: "Description Product",
    //     },
    //     $addToSet: {
    //       // $addToSet => hanya untuk field [], dan hanya akan memasukkan value ke dalam field 'imgUrls' jika value tersebut belum ada
    //       imgUrls:
    //         "https://www.freeiconspng.com/thumbs/blank-t-shirt-png/blank-t-shirt-png-19.jpg",
    //     },
    //   }
    // );

    // console.log(updateProduct);
    // await productCollections.updateOne(
    //   {
    //     _id: new ObjectId("6563628b170fa3cee3da635d"),
    //   },
    //   {
    //     $push: {  // $push => hanya untuk field [], dan tetap akan memasukan value ke dalam field 'imgUrls' walaupun value tersebut sudah ada
    //       imgUrls:
    //         "https://i.pinimg.com/474x/fd/98/4f/fd984fb68711478e032eb966309e409c.jpg",
    //     },
    //   }
    // );

    // //--- Delete One
    // const deleteProduct = await productCollections.deleteOne({
    //   _id: new ObjectId("656369593a310143297b1b11"),
    // });
    // console.log(deleteProduct);
  } catch (error) {
    await client.close();
  }
}

run();
