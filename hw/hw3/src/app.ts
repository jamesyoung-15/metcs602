import express from "express";
import bodyParser from "body-parser";
import contactsRouter from "./routes/contacts.js";
import { checkReminders } from "./services/notification.js";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

// determine paths for static files and data directory
const currDir = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(currDir, "../client");

const app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());
app.use("/contacts", contactsRouter);

app.use(express.static(clientDir)); // serve static files from client directory

app.get("/", (_req, res) => {
  res.sendFile("index.html", { root: clientDir });
});

const PORT = 3039;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// check reminders every minute
setInterval(async () => {
  await checkReminders();
}, 60 * 1000);

export default app;
