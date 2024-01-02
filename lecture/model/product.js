const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/mongoConnect");
const { GraphQLError } = require("graphql");

const getCollection = () => {
  const database = getDatabase();
  const productCollection = database.collection("products");

  return productCollection;
};

const getAllProduct = async () => {
  const productCollection = getCollection();

  const products = await productCollection.find().toArray();

  return products;
};

const getOneProduct = async (id) => {
  const productCollection = getCollection();
  const product = await productCollection.findOne({
    _id: new ObjectId(id),
  });

  return product;
};

const createOneProduct = async (payload) => {
  const productCollection = getCollection();

  // const newProduct = await productCollection.insertOne({
  //   // name: args.productInput.name,
  //   // stock: args.productInput.stock,
  //   // price: args.productInput.price,
  //   ...args.productInput,
  // });

  const newProduct = await productCollection.insertOne(payload);

  // console.log(newProduct, "<<< new product");

  const product = await productCollection.findOne({
    _id: newProduct.insertedId,
  });

  return product;
};

const updateOneProduct = async (id, payload) => {
  const productCollection = getCollection();

  const updatedProduct = await productCollection.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: payload,
    }
  );

  console.log(updatedProduct, "<<< updated product");

  const product = await productCollection.findOne({
    _id: new ObjectId(id),
  });

  return product;
};

const deleteOneProduct = async (id) => {
  const productCollection = getCollection();

  const deletedProduct = await productCollection.deleteOne({
    _id: new ObjectId(id),
  });

  console.log(deletedProduct, "<<< deleted product");

  if (!deletedProduct.deletedCount) {
    throw new GraphQLError("Product Not Found", {
      extensions: {
        code: "NOTFOUND",
        http: { status: 404 },
      },
    });
    // throw new Error("Product Not Found"); // return status 200
  }

  return deletedProduct;
};

module.exports = {
  getCollection,
  getAllProduct,
  getOneProduct,
  createOneProduct,
  updateOneProduct,
  deleteOneProduct,
};
