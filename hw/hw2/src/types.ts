// data for generated lottery ticket
type LotteryData = {
  dateGenerated: string;
  lotteryNumbers: number[];
  powerballNumber: number;
  is_deleted: boolean;
};

// data for user lottery input
type LotteryUserInput = {
  guessNumbers: number[];
  guessPowerball: number;
};

type LotteryResult = {
  lotteryData: LotteryData;
  userInput: LotteryUserInput;
  matchedNumbers: number[];
  matchedPowerball: boolean;
  prize: string;
};

const MAX_LOTTERY_NUMBER = 69;
const MAX_POWERBALL_NUMBER = 26;
const MAX_LOTTERY_COUNT = 5;
const DATA_DIR = "./data";

export {
  LotteryResult,
  LotteryData,
  LotteryUserInput,
  MAX_LOTTERY_NUMBER,
  MAX_POWERBALL_NUMBER,
  MAX_LOTTERY_COUNT,
  DATA_DIR,
};
