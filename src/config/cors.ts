import cors from 'cors';

const originPatterns = [
    /^http:\/\/localhost:\d+$/,  // Matches any localhost port
    /^https?:\/\/.*\.yourdomain\.com$/,  // Matches any subdomain of yourdomain.com
    /^https?:\/\/yourdomain\.com$/  // Matches yourdomain.com
];

export const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            // Allow requests with no origin (like mobile apps, curl, etc)
            callback(null, true);
            return;
        }

        // Check if origin matches any of our patterns
        const isAllowed = originPatterns.some(pattern => pattern.test(origin));
        
        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error(`Origin ${origin} not allowed by CORS policy`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}; 