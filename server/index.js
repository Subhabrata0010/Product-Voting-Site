const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const DB = require('./db/db');
const productRoutes = require('./routes/product.route');
const voteRoutes = require('./routes/vote.route');
const adminRouter = require('./routes/admin.route');
const errorHandler = require('./middleware/error');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

DB();

app.use(cors({
    origin: process.env.FRONTEND_URI || 'http://localhost:3000',
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', adminRouter);
app.use('/api/products', productRoutes);
app.use('/api/votes', voteRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});