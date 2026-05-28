const express = require('express');
const router = express.Router();
const {
  submitContactForm,
  getContactMessages,
  markAsReplied
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');

router.post('/', submitContactForm);
router.get('/', protect, admin, getContactMessages);
router.put('/:id/status', protect, admin, markAsReplied);

module.exports = router;
