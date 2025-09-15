import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";

import {
  simulateLotteryTicket,
  loadSavedLottery,
  loadLotteryData,
  deleteLotteryData
} from "./lotterySimulator.js";
import type { LotteryUserInput, LotteryResult } from "./types.js";
import {
  MAX_LOTTERY_COUNT,
  MAX_LOTTERY_NUMBER,
  MAX_POWERBALL_NUMBER,
} from "./types.js";

const app = express();
const port = 3023;
app.use(cors()); // enable cors for all routes to work locally

// determine paths for static files and data directory, remember don't use __dirname in ES modules
const currDir = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(currDir, "../client");
const dataDir = path.join(currDir, "../../data");

app.use(bodyParser.json());
app.use(express.static(clientDir)); // serve static files from client directory
app.use("/data", express.static(dataDir)); // Mount data files under /data route

app.get("/", (_req, res) => {
  res.sendFile("index.html", { root: clientDir });
});

// delete a specific lottery data file
app.delete("/data/:filename", async (req, res) => {
  const filename = req.params.filename;

  try {
    await deleteLotteryData(filename);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete lottery data" });
  }
});

// simulate a lottery ticket based on user input
app.post("/simulate", async (req, res) => {
  const userInput: LotteryUserInput = req.body;

  try {
    const result: LotteryResult = await simulateLotteryTicket(
      userInput,
      MAX_LOTTERY_NUMBER,
      MAX_POWERBALL_NUMBER,
      MAX_LOTTERY_COUNT,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// fetch past lottery results, returns last 10 by default as JSON
app.get("/history", async (_req, res) => {
  try {
    const savedJsons = await loadSavedLottery();
    const history = [];
    for (const file of savedJsons) {
      const data = await loadLotteryData(file);
      if (data) {
        history.push(data);
      }
    }
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to load history" });
  }
});

// start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
