const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

// GET ALL PROPERTIES (WITH SEARCH & FILTERS)
router.get('/', (req, res) => {
  try {
    const {
      keyword,
      city,
      postcode,
      property_type,
      listing_type,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      furnishing,
      parking,
      status,
      owner_id,
      is_featured,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const filters = {
      keyword,
      city,
      postcode,
      property_type,
      listing_type,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      furnishing,
      parking,
      status,
      owner_id,
      is_featured: is_featured === 'true' || is_featured === '1' ? 1 : undefined,
      ignoreStatusDefault: !!status
    };

    const result = db.getProperties(filters, sort, Number(limit), Number(page));
    res.json(result);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// GET FEATURED PROPERTIES
router.get('/featured', (req, res) => {
  try {
    const result = db.getProperties({ is_featured: 1, status: 'active' }, 'newest', 6, 1);
    res.json(result.properties);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch featured properties' });
  }
});

// GET SINGLE PROPERTY DETAILS
router.get('/:id', (req, res) => {
  try {
    const property = db.getPropertyById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    console.error('Error fetching property detail:', err);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// CREATE NEW PROPERTY LISTING
router.post('/', authenticateToken, requireRole(['seller', 'agent', 'admin']), (req, res) => {
  try {
    const {
      title,
      description,
      property_type,
      listing_type,
      price,
      address,
      city,
      postcode,
      latitude,
      longitude,
      bedrooms,
      bathrooms,
      area_sqft,
      construction_year,
      furnishing,
      parking_spaces,
      images,
      amenities
    } = req.body;

    if (!title || !price || !city || !address) {
      return res.status(400).json({ error: 'Title, price, address, and city are required' });
    }

    // Admins publish immediately, sellers/agents submit for pending moderation
    const status = req.user.role === 'admin' ? 'active' : 'pending';

    const newProp = db.createProperty(
      {
        title,
        description,
        property_type,
        listing_type,
        price,
        address,
        city,
        postcode,
        latitude,
        longitude,
        bedrooms,
        bathrooms,
        area_sqft,
        construction_year,
        furnishing,
        parking_spaces,
        status,
        owner_id: req.user.id
      },
      images,
      amenities
    );

    res.status(201).json({
      message: status === 'active' ? 'Property published successfully!' : 'Property submitted for review and moderation.',
      property: newProp
    });
  } catch (err) {
    console.error('Create property error:', err);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// UPDATE PROPERTY
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const prop = db.getPropertyById(req.params.id);
    if (!prop) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (prop.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to edit this property' });
    }

    const { images, amenities, ...restPropData } = req.body;
    const updated = db.updateProperty(req.params.id, restPropData, images, amenities);

    res.json({
      message: 'Property updated successfully',
      property: updated
    });
  } catch (err) {
    console.error('Update property error:', err);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// DELETE PROPERTY
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const prop = db.getPropertyById(req.params.id);
    if (!prop) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (prop.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to delete this property' });
    }

    db.deleteProperty(req.params.id);
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    console.error('Delete property error:', err);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// MODERATE / UPDATE PROPERTY STATUS (PUBLISH, REJECT, DEACTIVATE, SOLD)
router.patch('/:id/status', authenticateToken, (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['active', 'pending', 'sold', 'rented', 'inactive', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const prop = db.getPropertyById(req.params.id);
    if (!prop) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (prop.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to change property status' });
    }

    const updated = db.updateProperty(req.params.id, { status });
    res.json({ message: `Property status changed to ${status}`, property: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to change property status' });
  }
});

module.exports = router;
