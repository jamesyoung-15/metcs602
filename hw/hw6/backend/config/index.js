import dotenv from 'dotenv';

dotenv.config();

const app_configs = {
  port: process.env.PORT || 3055,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/patient-intaker',
  uploadDir: process.env.UPLOAD_DIR || 'data',
};

export default app_configs;