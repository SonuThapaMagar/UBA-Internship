export const typeDefs = `#graphql
  type User {
        id: ID!
        fname: String!
        lname: String!
        email: String!
        role: String!
        internships: [Internship!]
    }

    type Internship {
        id: ID!
        joinedDate: String!
        completionDate: String
        isCertified: Boolean!
        mentorName: String!
        user: User!
    }

    input UserInput {
        fname: String!
        lname: String!
        email: String!
        password: String!
        role: String
    }

    type Query {
        user(id: ID!): User
        users: [User!]
    }

    type Mutation {
        createUser(input: UserInput!): User
        updateUser(id: ID!, input: UserInput!): User
        deleteUser(id: ID!): Boolean
        login(email: String!, password: String!): String
    }
`;