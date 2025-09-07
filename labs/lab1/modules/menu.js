import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { exec } from "child_process";

export class Menu {
    constructor() {
        // readline interface for user input
        this.rl = readline.createInterface({ input: stdin, output: stdout });
    }

    // cli menu
    async displayMainMenu() {
        console.log("1. Convert Currency");
        console.log("2: Run Jamsine Tests");
        console.log("3. Exit");
        return await this.rl.question("Choose an option (1-3): ");
    }

    // get user input source currency
    async getSourceCurrency() {
        const sourceCurrency = await this.rl.question("What is the source currency? ");
        return sourceCurrency.toUpperCase();
    }

    // get user input target currency
    async getTargetCurrency() {
        const targetCurrency = await this.rl.question("What is the destination currency? ");
        return targetCurrency.toUpperCase();
    }

    // get user input amount to convert
    async getAmount() {
        const amount = await this.rl.question("How much money do you want to convert? ");
        return parseFloat(amount);
    }

    // run jasmine tests
    async runJasmineTests() {
        console.log("Running Jasmine tests...");
        return new Promise((resolve) => {
            exec("npm test", (error, stdout, stderr) => {
                if (error || stderr) {
                    console.error(`Error executing tests: ${error.message}`);
                    resolve();
                    return;
                }
                console.log(`Test Results:\n${stdout}`);
                resolve();
            });
        });
    }

    // cleanup
    close() {
        this.rl.close();
    }
}