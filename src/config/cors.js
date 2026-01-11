
const corsOptions = {
  origin: process.env.ORIGIN || '*',
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

