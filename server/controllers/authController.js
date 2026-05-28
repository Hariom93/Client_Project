const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

// Generate JWT token helper
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'supersecretkeygujjar123',
    { expiresIn: '30d' }
  );
};

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || undefined);

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // First user is automatically made admin for bootstrapping purposes
    const isFirstUser = (await User.countDocuments({})) === 0;
    const role = isFirstUser ? 'admin' : 'member';
    const status = isFirstUser ? 'approved' : 'pending'; // First user approved by default

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
      status
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
          token: generateToken(user._id, user.role)
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data provided' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      // Check if user is approved (unless admin)
      if (user.status !== 'approved' && user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: `Your membership is currently ${user.status}. Please wait for admin approval.`
        });
      }

      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
          token: generateToken(user._id, user.role)
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Google Sign-In
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ success: false, message: 'Missing Google credential token' });
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(500).json({ success: false, message: 'GOOGLE_CLIENT_ID is not configured on server' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const googleId = payload?.sub;
    const email = payload?.email?.toLowerCase();
    const name = payload?.name || 'Google User';
    const avatar = payload?.picture || '';

    if (!googleId || !email) {
      return res.status(401).json({ success: false, message: 'Invalid Google token payload' });
    }

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        avatar,
        password: Math.random().toString(36).slice(-12),
        role: 'member',
        status: 'approved'
      });
    } else {
      let changed = false;
      if (!user.googleId) {
        user.googleId = googleId;
        changed = true;
      }
      if (!user.avatar && avatar) {
        user.avatar = avatar;
        changed = true;
      }
      if (user.status !== 'approved' && user.role !== 'admin') {
        user.status = 'approved';
        changed = true;
      }
      if (changed) {
        await user.save();
      }
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        token: generateToken(user._id, user.role)
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: `Google authentication failed: ${error.message}` });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
