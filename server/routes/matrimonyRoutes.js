const express = require('express');
const router = express.Router();
const {
  getProfiles,
  getProfileById,
  getMyProfile,
  upsertMyProfile,
  sendContactRequest,
  respondContactRequest
} = require('../controllers/matrimonyController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getProfiles);
router.get('/myprofile', protect, getMyProfile);
router.post('/myprofile', protect, upsertMyProfile);
router.get('/profile/:id', protect, getProfileById);
router.post('/profile/:id/request', protect, sendContactRequest);
router.put('/requests/:requestId', protect, respondContactRequest);

module.exports = router;
