const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const DB = require('./db/db');
const productRoutes = require('./routes/product.route');
const voteRoutes = require('./routes/vote.route');
const error = require('./middleware/error');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

DB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRoutes);
app.use('/api/votes', voteRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use(error);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});