type TemperatureUnit = 'C' | 'F' | 'K';
interface ConversionResult {
    success: boolean;
    convertedValue?: number;
    convertedUnit?: TemperatureUnit;
    error?: string;
}

export const convertTemperature = (value : number, fromUnit: TemperatureUnit, toUnit: TemperatureUnit) : ConversionResult => {
    if (fromUnit === toUnit) {
        return {
            success: true,
            convertedValue: value,
            convertedUnit: toUnit
        };
    }

    if (isNaN(value)) {
        return {
            success: false,
            error: 'Invalid temperature value'
        };
    }

    let convertedValue: number;

    if (fromUnit === 'C') {
        if (toUnit === 'F') {
            convertedValue = (value * 9/5) + 32;
        } else {
            convertedValue = value + 273.15;
        }
    } else if (fromUnit === 'F') {
        if (toUnit === 'C') {
            convertedValue = (value - 32) * 5/9;
        } else {
            convertedValue = (value - 32) * 5/9 + 273.15;
        }
    } else {
        if (toUnit === 'C') {
            convertedValue = value - 273.15;
        } else {
            convertedValue = (value - 273.15) * 9/5 + 32;
        }
    }
    convertedValue = Math.round(convertedValue * 100) / 100; // round to 2 decimal places

    // console.log(`Converted ${value} from ${fromUnit} to ${toUnit}: ${convertedValue}`);
    const returnResult = {
        success: true,
        convertedValue: convertedValue,
        convertedUnit: toUnit
    }
    return returnResult;
};