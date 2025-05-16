export const typeDefs = `#graphql
  type User {
    id: ID!
    fname: String!
    lname: String!
  }

  type Address{
    id: ID! 
    street: String! 
    city: String! 
    country: String
  }

  type AddressCount{
    id: ID! 
    fname: String! 
    lname: String! 
    addresses: [Address!]
  }

  input UserInput{
    fname:String!
    lname:String!
  }
  
  input UserUpdateInput{
    fname:String
    lname:String
  }

  input AddressInput {
    street: String! 
    city: String! 
    country: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    usersWithAddressCount:[UserWithAddressCount!]!
  }

  type Mutation{
    createUser(input:UserInput!):User!
    updateUser(id:ID!, input:UserUpdateInput!):User!
    deleteUser(id:ID!):Boolean!
    createAddress(userId: ID!, 
    input: AddressInput!): Address!
  }
`;