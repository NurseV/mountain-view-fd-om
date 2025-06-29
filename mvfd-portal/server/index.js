// server/index.js

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

app.get('/', (req, res) => {
  res.send('MVFD Portal API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});