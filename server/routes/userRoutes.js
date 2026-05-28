const express = require('express');
const router = express.Router();
const { updateProfile, getDirectory } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.put('/profile', protect, updateProfile);
router.get('/directory', getDirectory);

module.exports = router;
