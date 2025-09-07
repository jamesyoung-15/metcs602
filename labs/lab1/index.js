import { Menu } from "./modules/menu.js";
import { CurrencyConverter } from "./modules/converter.js";

const key = "cur_live_ln5g6u0Nn5DALPpaUD3KA5Xey3DCU9M2gyUBKRez";
const converter = new CurrencyConverter(key);
const menu = new Menu();

const main = async () => {
    try {
        let running = true;
        
        while (running) {
            const choice = await menu.displayMainMenu();
            
            switch (choice) {
                case '1':
                    await handleCurrencyConversion();
                    break;
                case '2':
                    await menu.runJasmineTests();
                    break;
                case '3':
                    running = false;
                    break;
                default:
                    console.log("Invalid option. Please choose 1, 2, or 3.");
                    break;
            }
        }
    } catch (error) {
        console.error("An error occurred:", error.message);
    } finally {
        menu.close();
    }
}

const handleCurrencyConversion = async () => {
    try {
        const sourceCurrency = await menu.getSourceCurrency();
        const targetCurrency = await menu.getTargetCurrency();
        const amount = await menu.getAmount();

        console.log("Toast: Conversion in progress...");
        
        const result = await converter.convertCurrency(sourceCurrency, targetCurrency, amount);
        
        if (result.success) {
            console.log(`Toast: Conversion successful!`);
            console.log(`${result.sourceAmount} ${result.sourceCurrency} = ${result.convertedAmount.toFixed(2)} ${result.targetCurrency}`);
            console.log(`Exchange Rate: 1 ${result.sourceCurrency} = ${result.exchangeRate} ${result.targetCurrency}\n`);
        } else {
            console.error(`Toast Error: ${result.error}`);
        }
    } catch (error) {
        console.error("Conversion failed:", error.message);
    }
}

main();