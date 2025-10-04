import app from "./app.js";


const PORT = process.env.PORT || 3049;

console.log(process.env.MONGO_URI);

// Start express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});