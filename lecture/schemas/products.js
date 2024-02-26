const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/mongoConnection");
const {
  findAllProduct,
  findOneProductById,
  deleteOneProduct,
} = require("../model/product");

const typeDefs = `#graphql
  type Product {
    _id: ID
    name: String
    price: Int
    stock: Int
  }

  type Message {
    message: String
  }

  type Query {
    getProducts: [Product]
    getProductById(productId: ID!): Product
  }

  type Mutation {
    deleteProduct(productId: ID!): Message
    addProduct(name: String, price: Int, stock: Int): Product
    updateProduct(id: ID!, name: String, price: Int, stock: Int): Product
  }
`;

const resolvers = {
  Query: {
    getProducts: async () => {
      const products = await findAllProduct();
      console.log(products, "<<< products");
      // for await (const doc of products) {
      //   console.log(doc, "<<< doc");
      // }
      return products;
    },
    getProductById: async (_parent, args) => {
      const product = await findOneProductById(args.productId);

      return product;
    },
  },
  Mutation: {
    deleteProduct: async (_parent, args) => {
      const product = await deleteOneProduct(args.productId);

      console.log(product, "<<< product");

      return {
        message: `Successfully delete product with id ${args.productId}`,
      };
    },
    addProduct: async (_parent, args) => {
      // console.log(args);
      const db = getDatabase();
      const productCollection = db.collection("products");

      const newProduct = await productCollection.insertOne({
        name: args.name,
        price: args.price,
        stock: args.stock,
      }); // selalu return { acknowledge: boolean, insertedId: new ObjectId }

      const product = await productCollection.findOne({
        _id: new ObjectId(newProduct.insertedId),
      });

      console.log(product, "<<< product");
      return product;
      // return {};
    },
    updateProduct: async (_parent, args) => {
      const db = getDatabase();
      const productCollection = db.collection("products");

      const payloadUpdate = {};

      if (args.name) {
        payloadUpdate.name = args.name;
      }

      if (args.price || args.price === 0) {
        payloadUpdate.price = args.price;
      }

      if (args.stock || args.stock === 0) {
        payloadUpdate.stock = args.stock;
      }

      const updatedProduct = await productCollection.updateOne(
        {
          _id: new ObjectId(args.id),
        },
        {
          $set: payloadUpdate,
        }
      );

      const product = await productCollection.findOne({
        _id: new ObjectId(args.id),
      });

      return product;
    },
  },
};

module.exports = {
  productTypeDefs: typeDefs,
  productResolvers: resolvers,
};
