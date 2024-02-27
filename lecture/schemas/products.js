const {
  findAllProduct,
  findOneProductById,
  deleteOneProduct,
  addImagesProduct,
  createProduct,
  updatedProduct,
} = require("../model/product");

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
      const product = await createProduct({
        name: args.name,
        price: args.price,
        stock: args.stock,
        imageUrls: [],
      });
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
