const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

// All admin routes require admin role
router.use(authenticateToken, requireRole(['admin']));

// GET PLATFORM KPI STATS
router.get('/stats', (req, res) => {
  try {
    const stats = db.getAdminStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// GET ALL USERS (USER MANAGEMENT)
router.get('/users', (req, res) => {
  try {
    const users = db.getDB().users.map(u => {
      const { password, ...userWithoutPass } = u;
      return userWithoutPass;
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// UPDATE USER ROLE OR STATUS
router.patch('/users/:id', (req, res) => {
  try {
    const { role, status } = req.body;
    const user = db.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updates = {};
    if (role && ['buyer', 'seller', 'admin'].includes(role)) {
      updates.role = role;
    }
    if (status && ['active', 'banned', 'inactive'].includes(status)) {
      updates.status = status;
    }

    const updatedUser = db.updateUser(req.params.id, updates);
    const { password, ...userWithoutPass } = updatedUser;
    res.json({ message: 'User updated successfully', user: userWithoutPass });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE USER ACCOUNT
router.delete('/users/:id', (req, res) => {
  try {
    const targetUserId = Number(req.params.id);

    if (req.user.id === targetUserId) {
      return res.status(400).json({ error: 'You cannot delete your own admin account.' });
    }

    const user = db.findUserById(targetUserId);
    if (!user) {
      return res.status(404).json({ error: 'User account not found' });
    }

    const success = db.deleteUser(targetUserId);
    if (success) {
      res.json({ message: 'User account deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete user account' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user account' });
  }
});

// GET PENDING PROPERTIES FOR APPROVAL QUEUE
router.get('/pending-properties', (req, res) => {
  try {
    const pending = db.getProperties({ status: 'pending', ignoreStatusDefault: true }, 'newest', 50, 1);
    res.json(pending.properties);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending properties' });
  }
});

// GET CONTENT REPORTS / FLAGS
router.get('/reports', (req, res) => {
  try {
    const reports = db.getDB().reports.map(r => {
      const prop = db.getPropertyById(r.property_id);
      const user = db.findUserById(r.reported_by);
      return {
        ...r,
        property_title: prop ? prop.title : 'Deleted Property',
        reporter_name: user ? user.name : 'User'
      };
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

module.exports = router;
