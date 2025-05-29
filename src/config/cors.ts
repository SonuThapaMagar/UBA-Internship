import cors from 'cors';

const originPatterns = [
  /^http:\/\/localhost:\d+$/,
  /^https?:\/\/.*\.yourdomain\.com$/,
  /^https?:\/\/yourdomain\.com$/
];

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isAllowed = originPatterns.some(pattern => pattern.test(origin));
    if (isAllowed) return callback(null, true);
    callback(new Error(`Origin ${origin} not allowed by CORS policy`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
