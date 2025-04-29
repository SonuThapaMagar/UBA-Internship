export const typeDefs = `#graphql
  type User {
    id: ID!
    fname: String!
    lname: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }
`;