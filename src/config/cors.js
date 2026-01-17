
// Get allowed origins from environment variable, with fallbacks for development
const getAllowedOrigins = () => {
  const envOrigins = process.env.ORIGIN?.split(',').map(origin => origin.trim()) || [];
  
  // Add development origins if in development mode
  const devOrigins = process.env.NODE_ENV !== 'production' 
    ? ['http://localhost:5173', 'http://localhost:3000']
    : [];
  
  const allOrigins = [...new Set([...envOrigins, ...devOrigins])];
  
  return allOrigins.length > 0 ? allOrigins : '*';
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

