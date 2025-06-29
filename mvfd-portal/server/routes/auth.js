// server/routes/auth.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // <-- Import JWT

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  // Destructure and immediately trim whitespace from inputs
  const username = req.body.username ? req.body.username.trim() : undefined;
  const departmentName = req.body.departmentName ? req.body.departmentName.trim() : undefined;
  const { password } = req.body;

  if (!username || !departmentName || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const userQuery = `
      SELECT u.user_id, u.username, u.password_hash, u.first_name, u.last_name, r.role_name
      FROM users u
      JOIN departments d ON u.department_id = d.department_id
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.username = $1 AND d.department_name = $2;
    `;
    const { rows } = await db.query(userQuery, [username, departmentName]);

    if (rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // --- Create JWT Payload ---
    const payload = {
      user: {
        id: user.user_id,
        role: user.role_name,
      },
    };

    // --- Sign the Token ---
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 }, // Expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // <-- Send the token to the client
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;