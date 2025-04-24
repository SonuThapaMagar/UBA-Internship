import express from 'express'
import userRouter from './routes/userRoutes';
import bodyParser from 'body-parser';

export function startServer() {
    const app = express();
    const PORT = 3000;

    app.use(express.json());
    app.use(bodyParser.json());

    //Root route
    app.get('/', (req, res) => {
        res.send('API is running. Use /users endpoint');
    });

    //Mounting user routes
    app.use("/users", userRouter);

    //server listening at defined port
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}
// Starting the server
startServer();