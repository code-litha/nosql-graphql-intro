const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/mongoConnection");

const getCollection = () => {
  const db = getDatabase();
  const productCollection = db.collection("products");

  return productCollection;
};

const findAllProduct = async () => {
  const agg = [
    {
      $lookup: {
        from: "users",
        localField: "authorId",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: {
        path: "$author",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        "author.password": 0,
      },
    },
    {
      $sort: {
        name: 1,
      },
    },
    // {
    //   $limit: 3,
    // },
  ];

  const products = await getCollection().aggregate(agg).toArray();

  // console.log(products, "<<< products");
  // const products = await getCollection().find().toArray();

  return products;
};

const findOneProductById = async (id) => {
  const agg = [
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "authorId",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: {
        path: "$author",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        "author.password": 0,
      },
    },
    {
      $sort: {
        name: 1,
      },
    },
  ];
  const products = await getCollection().aggregate(agg).toArray();

  // console.log(products, "<<< products");
  // const product = await getCollection().findOne({
  //   _id: new ObjectId(id),
  // });

  return products[0];
};

const createProduct = async (payload) => {
  const productCollection = getCollection();

  const newProduct = await productCollection.insertOne(payload); // selalu return { acknowledge: boolean, insertedId: new ObjectId }

  const product = await productCollection.findOne({
    _id: new ObjectId(newProduct.insertedId),
  });

  // console.log(product, "<<< product");
  return product;
};

const updatedProduct = async ({ productId, payload }) => {
  const productCollection = getCollection();

  const updatedProduct = await productCollection.updateOne(
    {
      _id: new ObjectId(productId),
    },
    {
      $set: payload,
    }
  );

  const product = await productCollection.findOne({
    _id: new ObjectId(productId),
  });

  return product;
};

const deleteOneProduct = async (id) => {
  const product = await getCollection().deleteOne({
    _id: new ObjectId(id),
  });

  return product;
};

const addImagesProduct = async ({ productId, url }) => {
  const collection = getCollection();

  const updatedProduct = await collection.updateOne(
    {
      _id: new ObjectId(productId),
    },
    {
      // $addToSet: {  // ini melihat unique
      //   imageUrls: { url },
      // },
      $push: {
        imageUrls: { url },
      },
    }
  );

  console.log(updatedProduct, "<<< updatedProduct");

  const product = await findOneProductById(productId);
  return product;
};

module.exports = {
  getProductCollection: getCollection,
  findAllProduct,
  findOneProductById,
  deleteOneProduct,
  addImagesProduct,
  createProduct,
  updatedProduct,
};
