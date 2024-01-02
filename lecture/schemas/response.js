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
`;

module.exports = {
  responseTypeDefs: typeDefs,
};
