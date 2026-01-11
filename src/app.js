const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();


dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to client-backend API',
    status: 'success',
    version: '1.0.0',
  });
});

// Examples API route
app.get('/api/examples', (req, res) => {
  res.json({
    message: 'Examples API endpoint',
    status: 'success',
    data: [],
  });
});


module.exports = app;
