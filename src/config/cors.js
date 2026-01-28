import "dotenv/config";

// Get allowed origins from environment variable, with fallbacks for development
const getAllowedOrigins = () => {
  const envOrigins = process.env.ORIGIN
    ? process.env.ORIGIN.split(",").map(o => o.trim())
    : [];

  const devOrigins =
    process.env.NODE_ENV !== "production"
      ? ["http://localhost:5173", "http://localhost:3000"]
      : [];

  return [...new Set([...envOrigins, ...devOrigins])];
};

const corsOptions = {
  origin: getAllowedOrigins(),
  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS'
  ],
  
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  
  exposedHeaders: [
    'Content-Length',
    'X-Requested-With'
  ],
  
  credentials: true,

  preflightContinue: false,
  
  optionsSuccessStatus: 204
};

export default corsOptions;

