import express from 'express';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './graphql/schema/index';
import { resolvers } from './graphql/resolvers/index';
import { connectDB } from './data/mongo';
import userRouter from './routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';
import dotenv from 'dotenv';

dotenv.config();

export async function startServers() {
    try {
        await connectDB();
        const app = express();
        const REST_PORT = process.env.REST_PORT || 3000;
        const GRAPHQL_PORT = process.env.GRAPHQL_PORT || 4000;

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        app.get('/', (req, res) => {
            res.send(`
                <h1>API is running</h1>
                <ul>
                    <li><a href="/users">REST API</a></li>
                    <li><a href="http://localhost:${GRAPHQL_PORT}">GraphQL API</a></li>
                </ul>
            `);
        });

        app.use("/users", userRouter);
        app.use(errorHandler);

        const restServer = app.listen(REST_PORT, () => {
            console.log(`REST Server running at http://localhost:${REST_PORT}`);
        });

        const apolloServer = new ApolloServer({
            typeDefs,
            resolvers,
        });
        const { url } = await startStandaloneServer(apolloServer, {
            listen: { port: Number(GRAPHQL_PORT) },
        });
        console.log(`GraphQL Server ready at ${url}`);
        return { restServer, apolloServer };

    } catch (error) {
        console.error('Failed to start servers:', error);
        process.exit(1);
    }
}
startServers();
