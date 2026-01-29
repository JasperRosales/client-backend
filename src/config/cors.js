import "dotenv/config";

const allowedOrigins = process.env.ORIGIN
  ? process.env.ORIGIN.split(",").map(o => o.trim().replace(/\/$/, ""))
  : [];

if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:5173", "http://localhost:3000");
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); 

    const normalizedOrigin = origin.replace(/\/$/, "");
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, origin); 
    }

    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true, 
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers"
  ],
  exposedHeaders: ["Content-Length", "X-Requested-With"],
};

export default corsOptions;
