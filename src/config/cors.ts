export const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:4000'], // Adjust based on your frontend or Postman origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};