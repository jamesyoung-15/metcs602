import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import logger from "./config/logging.js";
import app_configs from "./config/index.js";
import intakeRoutes from './routes/intakeRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import insuranceRoutes from './routes/insuranceRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import tosRoutes from './routes/tosRoutes.js';

// Connect to MongoDB 
mongoose.connect(app_configs.mongoURI)
    .then(() => {
        logger.info("MongoDB connected");
    }).catch((err) => {
        logger.error("MongoDB connection error:", err);
    });

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(app_configs.uploadDir));

// Routes
app.use('/api/intake', intakeRoutes);
app.use('/api/health-questions', healthRoutes);
app.use('/api/insurance-details', insuranceRoutes);
app.use('/api/upload-card', uploadRoutes);
app.use('/api/schedule-appointment', scheduleRoutes);
app.use('/api/terms-of-service', tosRoutes);


app.listen(app_configs.port, () => {
    logger.info(`Server running on port ${app_configs.port}`);
});