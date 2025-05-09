import express from 'express'
import userRouter from './routes/userRoutes';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

export function startServer() {
    const app = express();
    const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

    app.use(express.json());
    app.use(bodyParser.json());

    //Root route
    app.get('/', (req, res) => {
        res.send('API is running. Use /users endpoint');
    });

    //Mounting user routes
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