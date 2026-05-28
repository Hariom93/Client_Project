const express = require('express');
const router = express.Router();
const {
  applyScholarship,
  getMyApplications,
  getMeritList
} = require('../controllers/scholarshipController');
const { protect } = require('../middleware/auth');

router.post('/apply', protect, applyScholarship);
router.get('/myapplications', protect, getMyApplications);
router.get('/meritlist', getMeritList);

module.exports = router;
