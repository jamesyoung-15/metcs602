import { convertTemperature } from '../server/temperatureConverter';

describe('Test Suite', () => {
    
    describe('Same unit conversions', () => {
        it('from C to C', () => {
            const result = convertTemperature(25, 'C', 'C');
            expect(result.success).toBe(true);
            expect(result.convertedValue).toBe(25);
            expect(result.convertedUnit).toBe('C');
        });

        it('from F to F', () => {
            const result = convertTemperature(77, 'F', 'F');
            expect(result.success).toBe(true);
            expect(result.convertedValue).toBe(77);
            expect(result.convertedUnit).toBe('F');
        });

        it('from K to K', () => {
            const result = convertTemperature(298.15, 'K', 'K');
            expect(result.success).toBe(true);
            expect(result.convertedValue).toBe(298.15);
            expect(result.convertedUnit).toBe('K');
        });
    });

    describe('Celsius conversions', () => {
        it('from C to F', () => {
            const result = convertTemperature(0, 'C', 'F');
            expect(result.success).toBe(true);
            expect(result.convertedValue).toBe(32);
            expect(result.convertedUnit).toBe('F');
        });

        it('from C to K', () => {
            const result = convertTemperature(0, 'C', 'K');
            expect(result.success).toBe(true);
            expect(result.convertedValue).toBe(273.15);
            expect(result.convertedUnit).toBe('K');
        });

        it('from C to F', () => {
            const result = convertTemperature(25, 'C', 'F');
            expect(result.success).toBe(true);
            expect(result.convertedValue).toBe(77);
            expect(result.convertedUnit).toBe('F');
        });
    });

    describe('Fahrenheit conversions', () => {
        it('should convert Fahrenheit to Celsius correctly', () => {
            const result = convertTemperature(32, 'F', 'C');
            expect(result.success).toBe(true);
            expect(result.convertedValue).toBe(0);
            expect(result.convertedUnit).toBe('C');
        });

        it('should convert Fahrenheit to Kelvin correctly', () => {
            const result = convertTemperature(32, 'F', 'K');
            expect(result.success).toBe(true);
            expect(result.convertedValue).toBe(273.15);
            expect(result.convertedUnit).toBe('K');
        });

        it('should convert 212°F to 100°C (boiling point)', () => {
            const result = convertTemperature(212, 'F', 'C');
            expect(result.success).toBe(true);
            expect(result.convertedValue).toBe(100);
            expect(result.convertedUnit).toBe('C');
        });
    });

    describe('Kelvin conversions', () => {
        it('should convert Kelvin to Celsius correctly', () => {
            const result = convertTemperature(273.15, 'K', 'C');
            expect(result.success).toBe(true);
            expect(result.convertedValue).toBe(0);
            expect(result.convertedUnit).toBe('C');
        });

        it('should convert Kelvin to Fahrenheit correctly', () => {
            const result = convertTemperature(273.15, 'K', 'F');
            expect(result.success).toBe(true);
            expect(result.convertedValue).toBe(32);
            expect(result.convertedUnit).toBe('F');
        });

        it('should convert 373.15K to 100°C (boiling point)', () => {
            const result = convertTemperature(373.15, 'K', 'C');
            expect(result.success).toBe(true);
            expect(result.convertedValue).toBe(100);
            expect(result.convertedUnit).toBe('C');
        });
    });

    describe('Decimal precision and rounding', () => {
        it('should round results to 2 decimal places', () => {
            const result = convertTemperature(23.456789, 'C', 'F');
            expect(result.success).toBe(true);
            expect(result.convertedValue).toBe(74.22); // 74.2222 -> 74.22
            expect(result.convertedUnit).toBe('F');
        });
    });

    describe('Error handling', () => {
        it('return error for NaN input', () => {
            const result = convertTemperature(NaN, 'C', 'F');
            expect(result.success).toBe(false);
            expect(result.error).toBe('Invalid temperature value');
            expect(result.convertedValue).toBeUndefined();
        });
    });

});