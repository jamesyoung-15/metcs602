import { convertTemperature } from "./server/temperatureConverter";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

type TemperatureUnit = 'C' | 'F' | 'K';

const rl = readline.createInterface({
    input,
    output
});

const menu = () => {
    console.log("\nTemperature Converion CLI");
    console.log("1. Convert Temperature");
    console.log("2. Exit");
}

// dead simple CLI loop
const start = async () => {
    while (true) {
        menu();
        const choice = await rl.question("Enter your choice: ");
        if (choice === '1') {
            const valueStr = await rl.question("Enter temperature value: ");
            const inputUnit = (await rl.question("Enter initial unit (C, F, K): ")).toUpperCase();
            const outUnit = (await rl.question("Enter unit to convert to (C, F, K): ")).toUpperCase();

            const value = parseFloat(valueStr);
            if (isNaN(value)) {
                console.log("Invalid temperature value. Please enter a numeric value.");
                continue;
            }
            if (inputUnit !== 'C' && inputUnit !== 'F' && inputUnit !== 'K') {
                console.log("Invalid input unit. Please enter C, F, or K.");
                continue;
            }
            if (outUnit !== 'C' && outUnit !== 'F' && outUnit !== 'K') {
                console.log("Invalid output unit. Please enter C, F, or K.");
                continue;
            }

            const result = convertTemperature(value, inputUnit as TemperatureUnit, outUnit as TemperatureUnit);
            if (result.success) {
                console.log(`${value} ${inputUnit} equal to around ${result.convertedValue} ${result.convertedUnit}`);
            } else {
                console.log(`Error: ${result.error}`);
            }
        } else if (choice === '2') {
            console.log("Exiting...");
            break;
        } else {
            console.log("Invalid choice. Please enter 1 or 2.");
        }
    }
    rl.close();
}

start();

