import { Request, Response } from 'express';
import { convertTemperature } from './temperatureConverter';

type TemperatureUnit = 'C' | 'F' | 'K';

const express = require('express')
const path = require('path');
const cors = require('cors');

const PORT = 6920;
const app = express();

app.use(cors()); // enable cors for all routes to work locally
app.use(express.static(path.join(__dirname, '../client'))); // assume client files are in parent directory

// serving frontend
app.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/convert', (req: Request, res: Response) => {
  const { value, fromUnit, toUnit } = req.query;

  // validate query parameters
  if (!value || !fromUnit || !toUnit) {
    return res.status(400).send('Missing query parameters');
  }
  if (isNaN(Number(value))) {
    return res.status(400).send('Invalid temperature value');
  }
  if (fromUnit !== 'C' && fromUnit !== 'F' && fromUnit !== 'K') {
    return res.status(400).send('Invalid fromUnit');
  }
  if (toUnit !== 'C' && toUnit !== 'F' && toUnit !== 'K') {
    return res.status(400).send('Invalid toUnit');
  }

  // perform conversion
  const result = convertTemperature(Number(value), fromUnit as TemperatureUnit, toUnit as TemperatureUnit);
  res.json({ result });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});