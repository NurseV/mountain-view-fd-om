// server/routes/debug.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// @route   GET api/debug/users
// @desc    (Temporary) Get all users to inspect data
// @access  Public
router.get('/users', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT user_id, username, password_hash, first_name, last_name, role_id FROM users');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;