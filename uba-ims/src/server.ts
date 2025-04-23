import express from 'express'
import userRouter from './routes/userRoutes';

export function startServer() {
    const app = express();
    const PORT = 3000;

    app.use(express.json());
    //Root route
    app.get('/', (req, res) => {
        res.send('Welcome to the User API. Use /users to access user data.');
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