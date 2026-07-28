const express = require('express');
const router = express.Router();
const db = require('../db');

// GET ALL REAL ESTATE AGENTS
router.get('/', (req, res) => {
  try {
    const agents = db.getAllAgents();
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// GET AGENT PROFILE BY USER ID
router.get('/:id', (req, res) => {
  try {
    const agent = db.getAgentProfileByUserId(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent profile not found' });
    }
    const listings = db.getProperties({ owner_id: req.params.id, ignoreStatusDefault: true }, 'newest', 20, 1);
    res.json({
      agent,
      listings: listings.properties
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch agent profile' });
  }
});

module.exports = router;
