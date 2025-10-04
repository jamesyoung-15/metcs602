import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// Use in-memory MongoDB server for testing
let mongoServer: MongoMemoryServer;

// Connect to the in-memory test database
export const connectTestDB = async () => {
    console.log("Connecting to in-memory MongoDB...");
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {});
    console.log("In-memory MongoDB connected");
};

// Disconnect and close the in-memory test database after tests
export const closeTestDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

// Clear all data from all collections in the test database
export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};