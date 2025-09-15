import {
  generatePowerballNumber,
  generateLotteryNumbers,
  validateUserInput,
  simulateLotteryTicket,
} from "../lotterySimulator.js";
import {
  MAX_LOTTERY_NUMBER,
  MAX_POWERBALL_NUMBER,
  MAX_LOTTERY_COUNT,
} from "../types.js";

describe("generateLotteryNumbers", () => {
  // Test 1: postive test, check basic functionality
  test("Generate 5 unique lottery numbers between 1 and 69", () => {
    const numbers = generateLotteryNumbers(69, 5);
    expect(numbers.length).toBe(5); // length should be 5
    expect(new Set(numbers).size).toBe(5); // Check for uniqueness
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b)); // should be ascending
  });
  // Test 2: negative tests, invalid numeric inputs for count and max
  test("Test invalid numeric inputs", () => {
    expect(() => generateLotteryNumbers(5, 10)).toThrow(
      "Cannot generate more unique numbers than the maximum possible value.",
    );
    expect(() => generateLotteryNumbers(0, 5)).toThrow(
      "Count must be positive and max must be at least 1.",
    );
    expect(() => generateLotteryNumbers(69, -5)).toThrow(
      "Count must be positive and max must be at least 1.",
    );
  });
  // Test 3: negative tests, inputs exceeding max allowed
  test("Test inputs exceeding max allowed", () => {
    expect(() => generateLotteryNumbers(70, 5)).toThrow(
      `Max number exceeds maximum allowed value of ${MAX_LOTTERY_NUMBER}.`,
    );
    expect(() => generateLotteryNumbers(69, 6)).toThrow(
      `Count exceeds maximum allowed value of ${MAX_LOTTERY_COUNT}.`,
    );
  });
  // Test 4: count = max, we know the output
  test("Edge case: count = max", () => {
    const numbers = generateLotteryNumbers(5, 5);
    expect(numbers.length).toBe(5);
    expect(new Set(numbers).size).toBe(5); // Check for uniqueness
    expect(numbers).toEqual([1, 2, 3, 4, 5]); // should be ascending
  });
});

describe("generatePowerballNumber", () => {
  // Test 5: postive test, check basic functionality
  test("Generate a Powerball number between 1 and 26", () => {
    const number = generatePowerballNumber(26);
    expect(number).toBeGreaterThanOrEqual(1);
    expect(number).toBeLessThanOrEqual(26);
  });
  // Test 6: negative tests, invalid input
  test("Test invalid input: max < 1", () => {
    expect(() => generatePowerballNumber(0)).toThrow("Max must be at least 1.");
    expect(() => generatePowerballNumber(-10)).toThrow(
      "Max must be at least 1.",
    );
  });
  // Test 7: negative tests, input exceeding max allowed
  test("Test input exceeding max allowed", () => {
    expect(() => generatePowerballNumber(27)).toThrow(
      `Max number exceeds maximum allowed value of ${MAX_POWERBALL_NUMBER}.`,
    );
  });
});

describe("validateUserInput", () => {
  // Test 8: postive test, valid input
  test("Valid user input", () => {
    const userInput = { guessNumbers: [5, 10, 15, 20, 25], guessPowerball: 10 };
    expect(() =>
      validateUserInput(
        userInput,
        MAX_LOTTERY_NUMBER,
        MAX_POWERBALL_NUMBER,
        MAX_LOTTERY_COUNT,
      ),
    ).not.toThrow();
  });
  // Test 9: negative tests, invalid number of guesses
  test("Invalid number of guesses", () => {
    const userInput1 = { guessNumbers: [5, 10, 15], guessPowerball: 10 };
    expect(() =>
      validateUserInput(
        userInput1,
        MAX_LOTTERY_NUMBER,
        MAX_POWERBALL_NUMBER,
        MAX_LOTTERY_COUNT,
      ),
    ).toThrow(
      `You must provide exactly ${MAX_LOTTERY_COUNT} lottery number guesses.`,
    );

    const userInput2 = {
      guessNumbers: [5, 10, 15, 20, 25, 30],
      guessPowerball: 10,
    };
    expect(() =>
      validateUserInput(
        userInput2,
        MAX_LOTTERY_NUMBER,
        MAX_POWERBALL_NUMBER,
        MAX_LOTTERY_COUNT,
      ),
    ).toThrow(
      `You must provide exactly ${MAX_LOTTERY_COUNT} lottery number guesses.`,
    );
  });

  // Test 10: negative tests, out of bounds guesses
  test("Out of bounds guesses", () => {
    const userInput1 = {
      guessNumbers: [0, 10, 15, 20, 25],
      guessPowerball: 10,
    };
    expect(() =>
      validateUserInput(
        userInput1,
        MAX_LOTTERY_NUMBER,
        MAX_POWERBALL_NUMBER,
        MAX_LOTTERY_COUNT,
      ),
    ).toThrow(`Lottery number 0 is out of bounds (1-${MAX_LOTTERY_NUMBER}).`);

    const userInput2 = {
      guessNumbers: [5, 10, 15, 20, 70],
      guessPowerball: 10,
    };
    expect(() =>
      validateUserInput(
        userInput2,
        MAX_LOTTERY_NUMBER,
        MAX_POWERBALL_NUMBER,
        MAX_LOTTERY_COUNT,
      ),
    ).toThrow(`Lottery number 70 is out of bounds (1-${MAX_LOTTERY_NUMBER}).`);

    const userInput3 = { guessNumbers: [5, 10, 15, 20, 25], guessPowerball: 0 };
    expect(() =>
      validateUserInput(
        userInput3,
        MAX_LOTTERY_NUMBER,
        MAX_POWERBALL_NUMBER,
        MAX_LOTTERY_COUNT,
      ),
    ).toThrow(
      `Powerball number 0 is out of bounds (1-${MAX_POWERBALL_NUMBER}).`,
    );

    const userInput4 = {
      guessNumbers: [5, 10, 15, 20, 25],
      guessPowerball: 30,
    };
    expect(() =>
      validateUserInput(
        userInput4,
        MAX_LOTTERY_NUMBER,
        MAX_POWERBALL_NUMBER,
        MAX_LOTTERY_COUNT,
      ),
    ).toThrow(
      `Powerball number 30 is out of bounds (1-${MAX_POWERBALL_NUMBER}).`,
    );
  });
});

describe("simulateLotteryTicket", () => {
  // Test 11: postive test, valid input, check output structure
  test("Should save and return lottery results", async () => {
    const userInput = { guessNumbers: [1, 2, 3, 4, 5], guessPowerball: 10 };

    const result = await simulateLotteryTicket(userInput);

    expect(result.userInput).toEqual(userInput);
    expect(result.lotteryData.lotteryNumbers).toHaveLength(5);
    expect(result.lotteryData.powerballNumber).toBeGreaterThanOrEqual(1);
    expect(result.lotteryData.powerballNumber).toBeLessThanOrEqual(26);
    expect(result.matchedNumbers).toBeInstanceOf(Array);
    expect(typeof result.matchedPowerball).toBe("boolean");
    expect(typeof result.prize).toBe("string");
  });
  // Test 12: negative test, invalid input should throw error
  test("Should throw error for invalid user input", async () => {
    const userInput = { guessNumbers: [1, 2, 3], guessPowerball: 10 }; // only 3 numbers instead of 5

    await expect(simulateLotteryTicket(userInput)).rejects.toThrow(
      `You must provide exactly ${MAX_LOTTERY_COUNT} lottery number guesses.`,
    );
  });
});
