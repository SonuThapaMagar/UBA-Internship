export const typeDefs = `#graphql
  type User {
    id: ID!
    fname: String!
    lname: String!
  }

  input UserInput{
    fname:String!
    lname:String!
  }
  
  input UserUpdateInput{
    fname:String
    lname:String
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation{
    createUser(input:UserInput!):User!
    updateUser(id:ID!, input:UserUpdateInput!):User!
    deleteUser(id:ID!):Boolean!
  }

`;