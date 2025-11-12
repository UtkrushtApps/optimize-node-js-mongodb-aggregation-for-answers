// app.js
const express = require('express');
const mongoose = require('mongoose');
const reviewRouter = require('./routes/review');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Body parser
app.use(bodyParser.json());

// MongoDB connection with connection pool & robust config
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 30 // Allow high concurrency
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/reviews', reviewRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
