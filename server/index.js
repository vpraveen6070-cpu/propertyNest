const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS & Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const enquiryRoutes = require('./routes/enquiries');
const favouriteRoutes = require('./routes/favourites');
const agentRoutes = require('./routes/agents');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/admin', adminRoutes);

// Master categories & master amenities endpoint for frontend forms
const db = require('./db');
app.use('/api/master-data', (req, res) => {
  res.json({
    categories: ['House', 'Apartment', 'Villa', 'Office', 'Penthouse', 'Land'],
    amenities: db.getDB().amenities
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Real Estate Server running on http://localhost:${PORT}`);
});
