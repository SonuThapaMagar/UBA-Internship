import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema/index';
import { resolvers } from './resolvers/index'
import { connectDB } from '../data/mongo';

export async function startGraphQLServer() {
    //DB Connection
    await connectDB();

    const server = new ApolloServer({
        typeDefs, resolvers

    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
    });

    console.log(`GraphQL Server ready at: ${url}`);
}
