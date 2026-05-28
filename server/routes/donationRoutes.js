const express = require('express');
const router = express.Router();
const {
  createDonation,
  verifyDonation,
  getLeaderboard,
  getStats
} = require('../controllers/donationController');
const { protect } = require('../middleware/auth');

// Middleware to conditionally run auth if token is present
const optionalProtect = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.post('/donate', optionalProtect, createDonation);
router.post('/verify', verifyDonation);
router.get('/leaderboard', getLeaderboard);
router.get('/stats', getStats);

module.exports = router;
