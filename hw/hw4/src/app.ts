import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./database.js";
import studentRoutes from "./routes/studentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import { fileURLToPath } from "url";
import path from "path";

// determine paths for static files and data directory
const currDir = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(currDir, "../client");

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

app.use(express.static(clientDir)); // serve static files from client directory

// Routes
app.get("/", (_req, res) => {
  res.sendFile("index.html", { root: clientDir });
});
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);

// Database Connection
connectDB();

export default app;