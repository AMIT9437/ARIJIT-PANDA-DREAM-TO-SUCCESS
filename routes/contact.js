const express = require('express');
const { body, validationResult } = require('express-validator');
const { dbHelper } = require('../config/database');

const router = express.Router();

// Submit contact form
router.post('/submit', [
    body('name').notEmpty().trim().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').optional().trim(),
    body('subject').notEmpty().trim().withMessage('Subject is required'),
    body('message').notEmpty().trim().withMessage('Message is required')
], async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: errors.array() 
            });
        }

        const { name, email, phone, subject, message } = req.body;

        // Store contact submission
        const result = await dbHelper.run(
            `INSERT INTO contacts (name, email, phone, subject, message, status) 
             VALUES (?, ?, ?, ?, ?, 'new')`,
            [name, email, phone, subject, message]
        );

        res.status(201).json({
            message: 'Contact form submitted successfully',
            contactId: result.id
        });

    } catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({ error: 'Failed to submit contact form' });
    }
});

// Get contact form statistics (public info)
router.get('/stats', async (req, res) => {
    try {
        // Get total contacts count
        const totalContacts = await dbHelper.get(
            'SELECT COUNT(*) as count FROM contacts'
        );

        // Get contacts by status
        const statusStats = await dbHelper.all(
            `SELECT status, COUNT(*) as count 
             FROM contacts 
             GROUP BY status`
        );

        res.json({
            totalContacts: totalContacts.count,
            statusBreakdown: statusStats
        });

    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to get statistics' });
    }
});

module.exports = router;
