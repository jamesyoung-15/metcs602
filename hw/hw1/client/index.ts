const form = document.getElementById('converter-form') as HTMLFormElement;
const convertUrl = 'http://localhost:6920/convert';

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const temperatureInput = document.getElementById('temperature') as HTMLInputElement;
    const fromUnitInput = document.getElementById('temperature-unit-input') as HTMLSelectElement;
    const toUnitInput = document.getElementById('temperature-unit-output') as HTMLSelectElement;
    const temperature = parseFloat(temperatureInput.value);
    const fromUnit = fromUnitInput.value;
    const toUnit = toUnitInput.value;

    const url = `${convertUrl}?value=${temperature}&fromUnit=${fromUnit}&toUnit=${toUnit}`;
    const response = await fetch(url);

    if (!response.ok) {
        const errorDiv = document.getElementById('error') as HTMLDivElement;
        errorDiv.innerText = `Error: ${response.statusText}`;
        return;
    }

    const data = await response.json();
    const convertedTemperature = data.result as { success: boolean; convertedValue?: number; convertedUnit?: string; error?: string };

    const resultDiv = document.getElementById('result') as HTMLDivElement;
    resultDiv.innerText = convertedTemperature.success ? `${convertedTemperature.convertedValue} ${convertedTemperature.convertedUnit}` : `Error: ${convertedTemperature.error}`;
});