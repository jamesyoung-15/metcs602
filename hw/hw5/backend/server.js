import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import venueRoutes from './routes/venues.js';
import cartRoutes from './routes/cart.js';
import Cart from './models/Cart.js';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import config from './config/index.js';

// init express
const app = express();

// init socket.io
const socketServer = http.createServer(app);
const io = new Server(socketServer, {
    cors: {
        origin: '*',
    }
});

// middleware
app.use(cors({
    origin: '*',
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/data', express.static('data'));

// connect to MongoDB, use different DB for tests
mongoose.connect(config.dbUri)
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

// socket.io
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// app.listen(expressPort, () => console.log(`Backend running on port ${expressPort}`));
socketServer.listen(config.port, () => {
    console.log(`Backend running on port ${config.port}`);
});