import CurrencyAPI from '@everapi/currencyapi-js';
import { isSupportedCurrency } from "./currencies.js";

export class CurrencyConverter {
    constructor(apiKey) {
        this.currencyApi = new CurrencyAPI(apiKey);
    }

    validateCurrency(currency) {
        return isSupportedCurrency(currency);
    }

    validateAmount(amount) {
        return !isNaN(amount) && amount > -1;
    }

    // REST API call to currencyapi.com to do the conversion
    async convertCurrency(sourceCurrency, targetCurrency, amount) {
        try {
            if (!this.validateCurrency(sourceCurrency)) {
                throw new Error(`Unsupported starting currency: ${sourceCurrency}`);
            }
            
            if (!this.validateCurrency(targetCurrency)) {
                throw new Error(`Unsupported target currency: ${targetCurrency}`);
            }

            if (!this.validateAmount(amount)) {
                throw new Error("Invalid, enter a positive number.");
            }

            const response = await this.currencyApi.latest({
                base_currency: sourceCurrency,
                currencies: targetCurrency
            });

            const exchangeRate = response.data[targetCurrency].value;
            const convertedAmount = amount * exchangeRate;

            return {
                success: true,
                sourceCurrency,
                targetCurrency,
                sourceAmount: amount,
                convertedAmount,
                exchangeRate,
                response
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}