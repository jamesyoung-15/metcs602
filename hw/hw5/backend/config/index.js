import dotenv from 'dotenv';

dotenv.config();

// Config object for backend application
const config = {
  port: process.env.PORT || 3049,
  dbUri: process.env.MONGO_URI || 'mongodb://localhost:27017/ticketmeister',
  jwtSecret: process.env.JWT_SECRET || 'mysecretkey',
};

export default config;