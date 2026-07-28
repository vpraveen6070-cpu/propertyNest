const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

// SUBMIT ENQUIRY FOR A PROPERTY
router.post('/', (req, res) => {
  try {
    const { property_id, sender_name, sender_email, sender_phone, message } = req.body;

    if (!property_id || !sender_name || !sender_email || !message) {
      return res.status(400).json({ error: 'Property ID, name, email, and message are required' });
    }

    const prop = db.getPropertyById(property_id);
    if (!prop) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const enquiry = db.createEnquiry({
      property_id,
      sender_name,
      sender_email,
      sender_phone,
      message,
      owner_id: prop.owner_id
    });

    res.status(201).json({
      message: 'Enquiry submitted successfully! The property owner will contact you shortly.',
      enquiry
    });
  } catch (err) {
    console.error('Submit enquiry error:', err);
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
});

// GET ENQUIRIES FOR CURRENT SELLER / ADMIN
router.get('/', authenticateToken, (req, res) => {
  try {
    let enquiries = [];
    if (req.user.role === 'admin') {
      enquiries = db.getDB().enquiries.map(e => {
        const prop = db.getPropertyById(e.property_id);
        return { ...e, property_title: prop ? prop.title : 'Property' };
      });
    } else {
      enquiries = db.getEnquiriesByOwner(req.user.id);
    }
    res.json(enquiries);
  } catch (err) {
    console.error('Fetch enquiries error:', err);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

// UPDATE ENQUIRY STATUS (READ, REPLIED, ARCHIVED)
router.patch('/:id/status', authenticateToken, (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = db.updateEnquiryStatus(req.params.id, status);
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    res.json({ message: 'Enquiry status updated', enquiry });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update enquiry status' });
  }
});

module.exports = router;
