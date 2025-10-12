import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import venueRoutes from './routes/venues.js';
import cartRoutes from './routes/cart.js';
import Cart from './models/Cart.js';
import dotenv from 'dotenv';

dotenv.config();

const expressPort = process.env.EXPRESS_PORT || 3049;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ticketmeister';

// init express
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/data', express.static('data'));

// connect to MongoDB, use different DB for tests
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    // clear cart on server start
    .then(() => Cart.deleteMany({}))
    .catch(err => console.log(err));

// routes
app.get('/', (req, res) => {
    res.send('Health check OK');
});
app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/cart', cartRoutes);

app.listen(expressPort, () => console.log(`Backend running on port ${expressPort}`));