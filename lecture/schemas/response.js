const typeDefs = `#graphql
  interface Response {
    statusCode: Int!
    message: String
    error: String
  }

  type ResponseBook implements Response {
    statusCode: Int!
    message: String
    error: String
    data: [Book]
  }

  type ResponseProduct implements Response {
    statusCode: Int!
    message: String
    error: String
    data: [Product]
  }

  type ResponseCreateProduct implements Response {
    statusCode: Int!
    message: String
    error: String
    data: Product
  }
`;

module.exports = {
  responseTypeDefs: typeDefs,
};
