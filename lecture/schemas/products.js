const {
  findAllProduct,
  findOneProductById,
  deleteOneProduct,
  addImagesProduct,
  createProduct,
  updatedProduct,
} = require("../model/product");
const Redis = require("ioredis");
const redis = new Redis(); // ini akan mengacu ke localhost:6379
// const redis = new Redis({
//   host: process.env.REDIS_HOST,
//   port: process.env.REDIS_PORT,
//   password: process.env.REDIS_PASSWORD,
// });

const typeDefs = `#graphql
  type Product {
    _id: ID
    name: String
    price: Int
    stock: Int
    authorId: ID
    author: User
    imageUrls: [Image]
  }

  type Image {
    url: String
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
    addImages(url: String!, productId: ID!): Product
  }
`;

const resolvers = {
  Query: {
    getProducts: async (parent, args, contextValue) => {
      const userLogin = await contextValue.auth();
      // console.log(userLogin, "<<< user login");

      /*
      1. kita cari dulu apakah sudah ada cacheProduct di  redis ?
      2. kalau ada, itu yang di return
      3. kalau ga ada, baru kita find dari database lalu kita set ke redis. dan itu yang di return
      */
      const productCache = await redis.get("data:products");

      console.log(productCache, "<<< product cache");
      if (productCache) {
        return JSON.parse(productCache);
      }
      const products = await findAllProduct();

      redis.set("data:products", JSON.stringify(products));

      // console.log(products, "<<< products");
      // for await (const doc of products) {
      //   console.log(doc, "<<< doc");
      // }
      return products;
    },
    getProductById: async (_parent, args, contextValue) => {
      const userLogin = await contextValue.auth();

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
      const product = await createProduct({
        name: args.name,
        price: args.price,
        stock: args.stock,
        imageUrls: [],
      });
      redis.del("data:products"); //Invalidate cache

      return product;
    },
    updateProduct: async (_parent, args) => {
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

      const product = await updatedProduct({
        productId: args.id,
        payload: payloadUpdate,
      });
      return product;
    },
    addImages: async (_parent, args) => {
      const { url, productId } = args;
      const product = await addImagesProduct({ productId, url });

      return product;
    },
  },
};

module.exports = {
  productTypeDefs: typeDefs,
  productResolvers: resolvers,
};
