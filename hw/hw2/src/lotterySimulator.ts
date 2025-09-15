import { promises as fs } from "fs";
import {
  MAX_LOTTERY_NUMBER,
  MAX_POWERBALL_NUMBER,
  MAX_LOTTERY_COUNT,
  DATA_DIR,
} from "./types.js";
import type { LotteryData, LotteryUserInput, LotteryResult } from "./types.js";

// function generates n random unique numbers from 1 to maxNumber
const generateLotteryNumbers = (
  maxNumber: number = MAX_LOTTERY_NUMBER,
  count: number = MAX_LOTTERY_COUNT,
): number[] => {
  // validate inputs, since we use typescript, don't need to check types
  if (count <= 0 || maxNumber < 1)
    throw new Error("Count must be positive and max must be at least 1.");
  if (count > maxNumber)
    throw new Error(
      "Cannot generate more unique numbers than the maximum possible value.",
    );
  if (count > MAX_LOTTERY_COUNT)
    throw new Error(
      `Count exceeds maximum allowed value of ${MAX_LOTTERY_COUNT}.`,
    );
  if (maxNumber > MAX_LOTTERY_NUMBER)
    throw new Error(
      `Max number exceeds maximum allowed value of ${MAX_LOTTERY_NUMBER}.`,
    );

  // use set to avoid duplicates
  const numbers: Set<number> = new Set();

  // generate n unique random numbers, add to set
  while (numbers.size < count) {
    const num = Math.floor(Math.random() * maxNumber) + 1;
    numbers.add(num);
  }

  // convert set to array and sort ascending order
  let numArray = Array.from(numbers);
  numArray.sort((a, b) => a - b);
  return numArray;
};

// function generates a single random number from 1 to maxNumber, default 26 since Powerball uses that
const generatePowerballNumber = (
  maxNumber: number = MAX_POWERBALL_NUMBER,
): number => {
  if (maxNumber < 1) throw new Error("Max must be at least 1.");
  if (maxNumber > MAX_POWERBALL_NUMBER)
    throw new Error(
      `Max number exceeds maximum allowed value of ${MAX_POWERBALL_NUMBER}.`,
    );
  const powerBall = Math.floor(Math.random() * maxNumber) + 1;
  return powerBall;
};

const saveLotteryData = async (data: LotteryResult): Promise<void> => {
  const filename = `${DATA_DIR}/${data.lotteryData.dateGenerated}.json`;
  const jsonData = JSON.stringify(data, null, 2);
  await fs.writeFile(filename, jsonData, "utf-8");
};

// load list of saved lottery JSON files, return filenames sorted by creation date descending, default last 10
const loadSavedLottery = async (numFiles: number = 10): Promise<string[]> => {
  try {
    // read all files in the data directory, filter for only JSON files
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    // get file stats to sort by creation time
    const filesWithStats = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = `${DATA_DIR}/${file}`;
        const stats = await fs.stat(filePath);
        return {
          filename: file,
          mtime: stats.mtime,
        };
      }),
    );

    // sort by modified time (newest first) and take last 10
    const sortedFiles = filesWithStats
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
      .slice(0, numFiles)
      .map((item) => item.filename);

    return sortedFiles;
  } catch (error) {
    console.error("Error reading saved lottery data:", error);
    return [];
  }
};

const loadLotteryData = async (
  filename: string,
): Promise<LotteryResult | null> => {
  const filePath = `${DATA_DIR}/${filename}`;

  try {
    const jsonData = await fs.readFile(filePath, "utf-8");
    return JSON.parse(jsonData) as LotteryResult;
  } catch (error) {
    console.error(`Error loading lottery data from ${filename}:`, error);
    return null;
  }
};

const deleteLotteryData = async (filename: string): Promise<void> => {
  const filePath = `${DATA_DIR}/${filename}`;

  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Error deleting lottery data file ${filename}:`, error);
  }
};

// runtime validation of user input
const validateUserInput = (
  userInput: LotteryUserInput,
  maxLotteryNumber: number = MAX_LOTTERY_NUMBER,
  maxPowerballNumber: number = MAX_POWERBALL_NUMBER,
  maxGuesses: number = MAX_LOTTERY_COUNT,
) => {
  // check types
  if (!Array.isArray(userInput.guessNumbers)) {
    throw new Error("guessNumbers must be an array.");
  }
  if (typeof userInput.guessPowerball !== "number") {
    throw new Error("guessPowerball must be a single number.");
  }

  // validate make sure numbers are in range and correct count
  if (userInput.guessNumbers.length !== maxGuesses) {
    throw new Error(
      `You must provide exactly ${maxGuesses} lottery number guesses.`,
    );
  }
  for (const num of userInput.guessNumbers) {
    if (num < 1 || num > maxLotteryNumber) {
      throw new Error(
        `Lottery number ${num} is out of bounds (1-${maxLotteryNumber}).`,
      );
    }
  }

  // check for uniqueness
  const uniqueNumbers = new Set(userInput.guessNumbers);
  if (uniqueNumbers.size !== userInput.guessNumbers.length) {
    throw new Error("All lottery numbers must be unique.");
  }

  // validate powerball guess
  if (
    userInput.guessPowerball < 1 ||
    userInput.guessPowerball > maxPowerballNumber
  ) {
    throw new Error(
      `Powerball number ${userInput.guessPowerball} is out of bounds (1-${maxPowerballNumber}).`,
    );
  }
};

const simulateLotteryTicket = async (
  userInput: LotteryUserInput,
  maxLotteryNumber: number = MAX_LOTTERY_NUMBER,
  maxPowerballNumber: number = MAX_POWERBALL_NUMBER,
  maxGuesses: number = MAX_LOTTERY_COUNT,
): Promise<LotteryResult> => {
  // runtime validation of user input
  validateUserInput(
    userInput,
    maxLotteryNumber,
    maxPowerballNumber,
    maxGuesses,
  );
  // generate lottery numbers and powerball
  const lotteryNumbers = generateLotteryNumbers(maxLotteryNumber, maxGuesses);
  const powerballNumber = generatePowerballNumber(maxPowerballNumber);
  const dateGenerated = new Date().toISOString();

  const lotteryData: LotteryData = {
    dateGenerated,
    lotteryNumbers,
    powerballNumber,
    is_deleted: false,
  };

  // compare user input with generated numbers
  const matchedNumbers = [];
  for (const num of userInput.guessNumbers) {
    if (lotteryNumbers.includes(num)) {
      matchedNumbers.push(num);
    }
  }
  const matchedPowerball = userInput.guessPowerball === powerballNumber;
  let prize = "No Prize";

  // random arbitrary prize logic
  if (matchedNumbers.length === lotteryNumbers.length && matchedPowerball) {
    prize = "Jackpot";
  } else if (matchedNumbers.length === lotteryNumbers.length) {
    prize = "$1,000,000";
  } else if (matchedNumbers.length > 0 && matchedPowerball) {
    prize = "$" + 5000 * matchedNumbers.length;
  } else if (matchedNumbers.length > 0) {
    prize = "$" + 100 * matchedNumbers.length;
  } else if (matchedPowerball) {
    prize = "$4";
  }

  let lotteryResult: LotteryResult = {
    lotteryData,
    userInput,
    matchedNumbers,
    matchedPowerball,
    prize,
  };

  await saveLotteryData(lotteryResult);

  return lotteryResult;
};

export {
  simulateLotteryTicket,
  generateLotteryNumbers,
  generatePowerballNumber,
  saveLotteryData,
  loadSavedLottery,
  loadLotteryData,
  validateUserInput,
  deleteLotteryData,
};
