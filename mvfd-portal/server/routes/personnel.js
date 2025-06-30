// server/routes/personnel.js
const express = require('express');
const router = express.Router();
const db = require('../db');
// We will create this middleware later to protect our routes
// const auth = require('../middleware/auth');

// @route   GET api/personnel
// @desc    Get all personnel
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT personnel_id, first_name, last_name, rank, status, badge_number FROM personnel ORDER BY last_name, first_name'
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/personnel/:id
// @desc    Get a single person's full profile
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    // Basic profile
    const personnelQuery = db.query('SELECT * FROM personnel WHERE personnel_id = $1', [req.params.id]);
    // Certifications
    const certsQuery = db.query('SELECT * FROM certifications WHERE personnel_id = $1 ORDER BY expiration_date', [req.params.id]);
    // Emergency Contacts
    const contactsQuery = db.query('SELECT * FROM emergency_contacts WHERE personnel_id = $1', [req.params.id]);

    // Run all queries in parallel
    const [personnelResult, certsResult, contactsResult] = await Promise.all([
      personnelQuery,
      certsQuery,
      contactsQuery
    ]);

    if (personnelResult.rows.length === 0) {
      return res.status(404).json({ msg: 'Personnel not found' });
    }

    const profile = {
      ...personnelResult.rows[0],
      certifications: certsResult.rows,
      emergency_contacts: contactsResult.rows
    }

    res.json(profile);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;