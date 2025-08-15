const express = require('express');
const { body, validationResult } = require('express-validator');
const { dbHelper } = require('../config/database');
const { authenticateToken, requireOwner } = require('./auth');

const router = express.Router();

// Apply authentication to all admin routes
router.use(authenticateToken);
router.use(requireOwner);

// Get all contacts with pagination and filtering
router.get('/contacts', async (req, res) => {
    try {
        const { page = 1, limit = 20, status, search } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = '';
        let params = [];

        // Add status filter
        if (status && status !== 'all') {
            whereClause += 'WHERE status = ?';
            params.push(status);
        }

        // Add search filter
        if (search) {
            const searchWhere = whereClause ? 'AND' : 'WHERE';
            whereClause += `${searchWhere} (name LIKE ? OR email LIKE ? OR subject LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        // Get total count
        const countQuery = `SELECT COUNT(*) as count FROM contacts ${whereClause}`;
        const totalResult = await dbHelper.get(countQuery, params);
        const totalContacts = totalResult.count;

        // Get contacts with pagination
        const contactsQuery = `
            SELECT id, name, email, phone, subject, message, status, created_at, updated_at
            FROM contacts 
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `;
        const contacts = await dbHelper.all(contactsQuery, [...params, parseInt(limit), offset]);

        res.json({
            contacts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalContacts / limit),
                totalContacts,
                hasNext: page * limit < totalContacts,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({ error: 'Failed to get contacts' });
    }
});

// Get single contact by ID
router.get('/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await dbHelper.get(
            'SELECT * FROM contacts WHERE id = ?',
            [id]
        );

        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.json({ contact });

    } catch (error) {
        console.error('Get contact error:', error);
        res.status(500).json({ error: 'Failed to get contact' });
    }
});

// Update contact status
router.put('/contacts/:id/status', [
    body('status').isIn(['new', 'read', 'replied', 'closed']).withMessage('Invalid status')
], async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { status } = req.body;

        // Check if contact exists
        const existingContact = await dbHelper.get(
            'SELECT id FROM contacts WHERE id = ?',
            [id]
        );

        if (!existingContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        // Update status
        await dbHelper.run(
            'UPDATE contacts SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, id]
        );

        res.json({ message: 'Contact status updated successfully' });

    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ error: 'Failed to update contact status' });
    }
});

// Add note to contact (optional feature)
router.post('/contacts/:id/note', [
    body('note').notEmpty().trim().withMessage('Note is required')
], async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { note } = req.body;

        // Check if contact exists
        const existingContact = await dbHelper.get(
            'SELECT id FROM contacts WHERE id = ?',
            [id]
        );

        if (!existingContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        // For now, we'll just update the message field with the note
        // In a real application, you might want a separate notes table
        await dbHelper.run(
            'UPDATE contacts SET message = message || ? || "\n\n[Admin Note: " || ? || "]", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            ['\n\n', note, id]
        );

        res.json({ message: 'Note added successfully' });

    } catch (error) {
        console.error('Add note error:', error);
        res.status(500).json({ error: 'Failed to add note' });
    }
});

// Delete contact
router.delete('/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if contact exists
        const existingContact = await dbHelper.get(
            'SELECT id FROM contacts WHERE id = ?',
            [id]
        );

        if (!existingContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        // Delete contact
        await dbHelper.run('DELETE FROM contacts WHERE id = ?', [id]);

        res.json({ message: 'Contact deleted successfully' });

    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
    try {
        // Total contacts
        const totalContacts = await dbHelper.get(
            'SELECT COUNT(*) as count FROM contacts'
        );

        // Contacts by status
        const statusStats = await dbHelper.all(
            `SELECT status, COUNT(*) as count 
             FROM contacts 
             GROUP BY status`
        );

        // Recent contacts (last 7 days)
        const recentContacts = await dbHelper.all(
            `SELECT COUNT(*) as count 
             FROM contacts 
             WHERE created_at >= datetime('now', '-7 days')`
        );

        // Total users
        const totalUsers = await dbHelper.get(
            'SELECT COUNT(*) as count FROM users'
        );

        res.json({
            totalContacts: totalContacts.count,
            totalUsers: totalUsers.count,
            recentContacts: recentContacts[0].count,
            statusBreakdown: statusStats
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ error: 'Failed to get dashboard statistics' });
    }
});

// Get all users (admin only)
router.get('/users', async (req, res) => {
    try {
        const users = await dbHelper.all(
            'SELECT id, username, email, role, created_at, updated_at FROM users ORDER BY created_at DESC'
        );

        res.json({ users });

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to get users' });
    }
});

module.exports = router;
