import { CurrencyConverter } from "../modules/converter.js";

describe("CurrencyConverter", function() {
    let converter;
    
    beforeEach(function() {
        converter = new CurrencyConverter("cur_live_ln5g6u0Nn5DALPpaUD3KA5Xey3DCU9M2gyUBKRez");
    });

    describe("validateCurrency", function() {
        it("supported currencies", function() {
            expect(converter.validateCurrency("USD")).toBe(true);
            expect(converter.validateCurrency("HKD")).toBe(true);
            expect(converter.validateCurrency("GBP")).toBe(true);
        });

        it("unsupported currencies", function() {
            expect(converter.validateCurrency("XYZ")).toBe(false);
            expect(converter.validateCurrency("ABC")).toBe(false);
            expect(converter.validateCurrency("")).toBe(false);
        });
    });

    describe("validateAmount", function() {
        it("valid positive numbers", function() {
            expect(converter.validateAmount(100)).toBe(true);
            expect(converter.validateAmount(0.01)).toBe(true);
            expect(converter.validateAmount(1000.50)).toBe(true);
        });

        it("invalid amounts", function() {
            expect(converter.validateAmount(-100)).toBe(false);
            expect(converter.validateAmount(NaN)).toBe(false);
            expect(converter.validateAmount("abc")).toBe(false);
        });
    });

    // 
    // describe("convertCurrency", function() {
    //     it("api call", async function() {
    //         const result = await converter.convertCurrency("USD", "HKD", 100);
    //         expect(result.success).toBe(true);
    //     });
    // });
            
});