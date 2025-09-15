import {
  simulateLotteryTicket,
  loadSavedLottery,
  loadLotteryData,
  deleteLotteryData,
} from "./lotterySimulator.js";
import type { LotteryUserInput, LotteryResult } from "./types.js";
import {
  MAX_LOTTERY_COUNT,
  MAX_LOTTERY_NUMBER,
  MAX_POWERBALL_NUMBER,
} from "./types.js";
import * as readline from "readline";

const gameMenu = `
Lottery Simulator Menu:
1. Enter your lottery number guesses
2. View past results
3. Delete a past result
4. Exit
`;

const main = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Welcome to the Lottery Simulator!\n");

  // Function to ask a question and get user input
  const askQuestion = (question: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  };

  //   main game loop
  while (true) {
    console.log(gameMenu);
    const choice = await askQuestion("Please select an option (1-4): ");

    // handle user choice
    if (choice === "1") {
      // normal lottery play, user validation is done in simulateLotteryTicket
      try {
        // get user lottery number guesses
        const numbersInput = await askQuestion(
          `Enter your ${MAX_LOTTERY_COUNT} lottery number guesses (between 1 and ${MAX_LOTTERY_NUMBER}) separated by spaces: `,
        );
        const guessNumbers = numbersInput
          .split(" ")
          .map((num) => parseInt(num))
          .filter((num) => !isNaN(num));
        const powerBallInput = await askQuestion(
          `Enter your Powerball number guess (between 1 and ${MAX_POWERBALL_NUMBER}): `,
        );
        const guessPowerball = parseInt(powerBallInput);

        // simulate lottery ticket
        const userInput: LotteryUserInput = { guessNumbers, guessPowerball };
        const result: LotteryResult = await simulateLotteryTicket(
          userInput,
          MAX_LOTTERY_NUMBER,
          MAX_POWERBALL_NUMBER,
          MAX_LOTTERY_COUNT,
        );

        // print results
        console.log("\nLottery Results:");
        console.log(
          `Generated Lottery Numbers: ${result.lotteryData.lotteryNumbers.join(", ")}`,
        );
        console.log(
          `Generated Powerball Number: ${result.lotteryData.powerballNumber}`,
        );
        console.log(
          `Your Matched Numbers: ${result.matchedNumbers.join(", ")}`,
        );
        console.log(
          `Matched Powerball: ${result.matchedPowerball ? "Yes" : "No"}`,
        );
        console.log(`You Won: ${result.prize}`);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    } else if (choice === "2") {
      // fetch data from data directory and display to user
      const savedJsons = await loadSavedLottery();
      if (savedJsons.length === 0) {
        console.log("No past lottery results found.");
        continue;
      }
      console.log(`\nPast ${savedJsons.length} Lottery Results:`);
      for (const file of savedJsons) {
        const data = await loadLotteryData(file);
        if (data) {
          console.log(`\nDate: ${data.lotteryData.dateGenerated}`);
          console.log(
            `Lottery Numbers: ${data.lotteryData.lotteryNumbers.join(", ")}`,
          );
          console.log(`Powerball Number: ${data.lotteryData.powerballNumber}`);
          console.log(
            `Your Guesses: ${data.userInput.guessNumbers.join(", ")}`,
          );
          console.log(`Your Powerball Guess: ${data.userInput.guessPowerball}`);
          console.log(`Matched Numbers: ${data.matchedNumbers.join(", ")}`);
          console.log(
            `Matched Powerball: ${data.matchedPowerball ? "Yes" : "No"}`,
          );
          console.log(`Prize: ${data.prize}`);
        } else {
          console.log(`Failed to load data from file: ${file}`);
        }
      }
      console.log("");
    } else if (choice === "3") {
      // delete a past result
      const savedJsons = await loadSavedLottery();
      if (savedJsons.length === 0) {
        console.log("No past lottery results found to delete.");
        continue;
      }
      console.log("\nPast Lottery Results:");
      savedJsons.forEach((file, index) => {
        console.log(`${index + 1}. ${file}`);
      });
      const deleteInput = await askQuestion(
        `Enter the number of the result you want to delete (1-${savedJsons.length}): `,
      );
      const deleteIndex = parseInt(deleteInput) - 1;
      if (
        isNaN(deleteIndex) ||
        deleteIndex < 0 ||
        deleteIndex >= savedJsons.length
      ) {
        console.log("Invalid selection. Please try again.\n");
        continue;
      }
      const fileToDelete = savedJsons[deleteIndex];
      await deleteLotteryData(fileToDelete);
      console.log(`Deleted lottery result: ${fileToDelete}\n`);
    } else if (choice === "4") {
      console.log("Thank you for playing! Goodbye.");
      break;
    } else {
      console.log("Invalid choice. Please select a valid option.\n");
    }
  }

  rl.close();
};

main();
