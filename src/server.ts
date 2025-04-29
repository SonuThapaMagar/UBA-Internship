import express from 'express'
import userRouter from './routes/userRoutes';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import { errorHandler } from './middleware/errorHandler';
// import { connectDB } from './data/mongo'

dotenv.config();

export async function startServer() {

    dotenv.config();

    // await connectDB();

    const app = express();
    const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

    app.use(express.json());
    app.use(bodyParser.json());


    //Root route
    app.get('/', (req, res) => {
        res.send('API is running. Use /users endpoint');
    });

    //Mounting user routes (REST API)
    app.use("/users", userRouter);

    //Error handler
    app.use(errorHandler);

    //server listening at defined port
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}
// Starting the server
startServer();