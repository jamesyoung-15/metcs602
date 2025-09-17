import express from 'express';

const app = express();
const port = 3018;

app.get('/', (req, res) => {
    res.send('Go to /hello or /ip');
});

// 1. Create a GET route, /hello that will respond with "Hello, Guest", if there is no name parameter in the querystring.
app.get('/hello', (req, res) => {
  const name = req.query.name || 'Guest';
  res.send(`Hello, ${name}`);
});

// Create a GET route /ip that will respond with showing the user's IP.
app.get('/ip', (req, res) => {
  const userIP = req.ip || 'Unknown';
  res.send(`Your IP address is: ${userIP}`);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});