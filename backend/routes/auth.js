const express = require('express');
const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
const User = require('../models/User');

const router = express.Router();

const generateToken = (id, email, role, walletAddress) => {
  return jwt.sign(
    { id, email, role, walletAddress },
    process.env.JWT_SECRET || 'healnow_super_secret_key_2026',
    { expiresIn: '30d' }
  );
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (patient or doctor) — auto-generates ETH wallet
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role, specialty, hospital, qualifications } = req.body;

    // Validate
    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }
    if (!['patient', 'doctor'].includes(role)) {
      return res.status(400).json({ message: 'Role must be patient or doctor' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Generate managed Ethereum wallet
    const wallet = ethers.Wallet.createRandom();
    const did = `did:ethr:${wallet.address}`;

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name,
      role,
      walletAddress: wallet.address.toLowerCase(),
      walletPrivateKey: wallet.privateKey,
      specialty: role === 'doctor' ? (specialty || '') : '',
      hospital: role === 'doctor' ? (hospital || '') : '',
      qualifications: role === 'doctor' ? (qualifications || '') : '',
      did,
    });

    const token = generateToken(user._id, user.email, user.role, user.walletAddress);

    res.status(201).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      walletAddress: user.walletAddress,
      did: user.did,
      specialty: user.specialty,
      hospital: user.hospital,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.email, user.role, user.walletAddress);

    res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      walletAddress: user.walletAddress,
      did: user.did,
      specialty: user.specialty,
      hospital: user.hospital,
      isVerified: user.isVerified,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 */
const { protect } = require('../middleware/auth');
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
