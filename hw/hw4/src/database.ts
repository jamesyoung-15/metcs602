import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === "test") {
        console.log("Skipping production DB connection in test environment");
        return; // Skip connection during tests
    }
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI || "", {});
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;