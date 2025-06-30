// server/index.js

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/personnel', require('./routes/personnel'));
app.use('/api/applicants', require('./routes/applicants'));
app.use('/api/debug', require('./routes/debug'));

// A test route to verify database connection
app.get('/api/db-test', async (req, res) => {
  try {
    const data = await db.query('SELECT NOW()');
    res.json({
      message: 'Database connection successful!',
      time: data.rows[0].now,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error: Could not connect to database.');
  }
});

app.get('/', (req, res) => {
  res.send('MVFD Portal API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});