const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/product.routes');

const app = express();
app.use(express.json());

// Dùng cho healthcheck ở Prompt 9
app.get('/health', (req, res) => {
  const dbOk = mongoose.connection.readyState === 1;
  //res.status(dbOk ? 200 : 503).json({ status: dbOk ? 'ok' : 'error', db: dbOk });
  res.status(dbOk ? 200 : 503).json({ status: dbOk ? 'ok' : 'error', db: dbOk, version: '1.1.0' });
});

app.use('/products', productRoutes);

module.exports = app;