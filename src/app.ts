import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { initializeDataSource } from './data/mysql';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import userRouter from './routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

export async function startServers() {
    let restServer: any = null;
    let apolloServer: any = null;
    try {
        const REST_PORT = process.env.REST_PORT || 3000;
        const GRAPHQL_PORT = process.env.GRAPHQL_PORT || 4000;

        //Initializing MySQL
        await initializeDataSource();

        const app = express();
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

        //Rest server
        restServer = app.listen(REST_PORT, () => {
            console.log(`REST Server running at http://localhost:${REST_PORT}`);
        });

        // GraphQL Server
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
        if (restServer) restServer.close();
        if (apolloServer) await apolloServer.stop().catch(() => { });
        process.exit(1);
    }
}
startServers();
