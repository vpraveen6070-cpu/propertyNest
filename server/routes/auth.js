const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

// REGISTER USER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = db.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const validRoles = ['buyer', 'seller'];
    const userRole = validRoles.includes(role) ? role : 'buyer';

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = db.createUser({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      phone: phone || '',
      bio: bio || '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPass } = newUser;

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: userWithoutPass
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// LOGIN USER
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPass } = user;

    return res.json({
      message: 'Login successful',
      token,
      user: userWithoutPass
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// GET CURRENT USER PROFILE
router.get('/me', authenticateToken, (req, res) => {
  const user = db.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password: _, ...userWithoutPass } = user;
  res.json({ user: userWithoutPass });
});

// UPDATE PROFILE
router.put('/me', authenticateToken, (req, res) => {
  const { name, phone, bio, avatar } = req.body;
  const updatedUser = db.updateUser(req.user.id, {
    name: name || req.user.name,
    phone: phone !== undefined ? phone : req.user.phone,
    bio: bio !== undefined ? bio : req.user.bio,
    avatar: avatar || req.user.avatar
  });

  const { password: _, ...userWithoutPass } = updatedUser;
  res.json({ message: 'Profile updated successfully', user: userWithoutPass });
});

// REQUEST PASSWORD RESET
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = db.findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'No account found with this email address' });
  }
  // In a production app, an email with a reset token is dispatched here
  res.json({ message: 'Password reset link has been dispatched to your email address.' });
});

module.exports = router;
