import express from 'express'
import userRouter from './routes/userRoutes';

export function startServer() {
    const app = express();
    const PORT = 3000;

    app.use(express.json());

    app.use("/users/", userRouter);
    
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
}