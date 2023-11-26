const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/mongoConnection");

class Product {
  static collections() {
    return getDatabase().collection("products");
  }

  static async findAll() {
    return await this.collections().find().toArray();
  }

  static async findOne(id) {
    return await this.collections().findOne({
      _id: new ObjectId(id),
    });
  }

  static async create(payload) {
    try {
      const product = await this.collections().insertOne(payload);

      return await this.findOne(product.insertedId);
    } catch (error) {
      throw error;
    }
  }

  static async updateOne(id, payload) {
    try {
      await this.collections().updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: payload,
        }
      );
      return await this.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  static async upsertImgUrls(id, imgUrl) {
    try {
      await this.collections().updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $addToSet: {
            imgUrls: imgUrl,
          },
        }
      );
      return await this.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    return await this.collections().deleteOne({
      _id: new ObjectId(id),
    });
  }
}

module.exports = Product;
