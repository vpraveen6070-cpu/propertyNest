const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// GET USER SAVED FAVOURITES
router.get('/', authenticateToken, (req, res) => {
  try {
    const favourites = db.getFavouritesByUser(req.user.id);
    res.json(favourites);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch saved favourites' });
  }
});

// TOGGLE FAVOURITE FOR A PROPERTY
router.post('/:propertyId', authenticateToken, (req, res) => {
  try {
    const result = db.toggleFavourite(req.user.id, req.params.propertyId);
    res.json({
      message: result.saved ? 'Property saved to favourites' : 'Property removed from favourites',
      saved: result.saved
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update favourite' });
  }
});

module.exports = router;
