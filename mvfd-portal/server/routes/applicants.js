// server/routes/applicants.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// @route   GET api/applicants
// @desc    Get all applicants
router.get('/', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM applicants ORDER BY application_date DESC');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/applicants
// @desc    Add a new applicant
router.post('/', async (req, res) => {
    const { first_name, last_name, email, phone_number, notes } = req.body;
    try {
        const newApplicant = await db.query(
            'INSERT INTO applicants (first_name, last_name, email, phone_number, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [first_name, last_name, email, phone_number, notes]
        );
        res.json(newApplicant.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/applicants/:id
// @desc    Update an applicant's status or notes
router.put('/:id', async (req, res) => {
    const { status, notes } = req.body;
    try {
        const updatedApplicant = await db.query(
            'UPDATE applicants SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP WHERE applicant_id = $3 RETURNING *',
            [status, notes, req.params.id]
        );
        if (updatedApplicant.rows.length === 0) {
            return res.status(404).json({ msg: 'Applicant not found' });
        }
        res.json(updatedApplicant.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST api/applicants/:id/promote
// @desc    Promote an applicant to an employee
router.post('/:id/promote', async (req, res) => {
    const { id } = req.params;
    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        const applicantRes = await client.query('SELECT * FROM applicants WHERE applicant_id = $1 FOR UPDATE', [id]);
        if (applicantRes.rows.length === 0) {
            throw new Error('Applicant not found');
        }
        const applicant = applicantRes.rows[0];

        if (applicant.status === 'Hired') {
            throw new Error('Applicant has already been hired.');
        }

        const tempPassword = Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(tempPassword, salt);

        // Use a temporary, unique username for the initial insert
        const tempUsername = `temp_${Date.now()}`;

        // Create the new login User with corrected parameters
        const newUserRes = await client.query(
            `INSERT INTO users (username, password_hash, first_name, last_name, role_id, department_id)
             VALUES ($1, $2, $3, $4, (SELECT role_id FROM roles WHERE role_name = 'Firefighter'), 1)
             RETURNING *`,
            [tempUsername, passwordHash, applicant.first_name, applicant.last_name]
        );
        const newUser = newUserRes.rows[0];

        // Create the new Personnel record
        const newPersonnelRes = await client.query(
            `INSERT INTO personnel (user_id, first_name, last_name, email, phone_number, hire_date, status, probation_end_date, employee_id)
             VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, 'Probation', CURRENT_DATE + INTERVAL '90 days',
             (SELECT COALESCE(MAX(employee_id::int), 0) + 1 FROM personnel)::text)
             RETURNING *`,
            [newUser.user_id, applicant.first_name, applicant.last_name, applicant.email, applicant.phone_number]
        );
        const newPersonnel = newPersonnelRes.rows[0];

        // Update the user's username with the permanent one
        const finalUsername = `${applicant.first_name.charAt(0).toLowerCase()}${applicant.last_name.toLowerCase()}${newPersonnel.employee_id}`;
        await client.query('UPDATE users SET username = $1 WHERE user_id = $2', [finalUsername, newUser.user_id]);
        
        // Link the new personnel record to the user record
        await client.query('UPDATE personnel SET user_id = $1 WHERE personnel_id = $2', [newUser.user_id, newPersonnel.personnel_id]);

        await client.query("UPDATE applicants SET status = 'Hired' WHERE applicant_id = $1", [id]);

        await client.query('COMMIT');

        res.json({
            message: 'Applicant promoted successfully',
            newPersonnel,
            finalUsername,
            tempPassword
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Server Error');
    } finally {
        client.release();
    }
});


module.exports = router;