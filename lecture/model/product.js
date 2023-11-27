const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/db");

class Product {
  static collection() {
    const database = getDatabase();
    const productCollection = database.collection("products");

    return productCollection;
  }

  static async findAll() {
    const products = await this.collection().find({}).toArray();

    return products;
  }

  static async findOne(id) {
    const product = await this.collection().findOne({
      _id: new ObjectId(id),
    });

    return product;
  }
}

module.exports = Product;
