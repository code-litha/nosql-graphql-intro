const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/mongoConnection");

const getCollection = () => {
  const db = getDatabase();
  const productCollection = db.collection("products");

  return productCollection;
};

const findAllProduct = async () => {
  const products = await getCollection().find().toArray();

  return products;
};

const findOneProductById = async (id) => {
  const product = await getCollection().findOne({
    _id: new ObjectId(id),
  });

  return product;
};

const deleteOneProduct = async (id) => {
  const product = await getCollection().deleteOne({
    _id: new ObjectId(id),
  });

  return product;
};

module.exports = {
  findAllProduct,
  findOneProductById,
  deleteOneProduct,
};
