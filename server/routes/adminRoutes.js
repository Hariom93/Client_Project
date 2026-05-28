const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  updateMemberStatus,
  getAllScholarships,
  updateScholarshipStatus,
  getAllDonations,
  getAllMatrimony,
  updateMatrimonyStatus,
  deleteBusiness,
  sendNotification
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// Lock down all routes in this file to authorized admins only
router.use(protect);
router.use(admin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateMemberStatus);
router.get('/scholarships', getAllScholarships);
router.put('/scholarships/:id/status', updateScholarshipStatus);
router.get('/donations', getAllDonations);
router.get('/matrimony', getAllMatrimony);
router.put('/matrimony/:id/status', updateMatrimonyStatus);
router.delete('/businesses/:id', deleteBusiness);
router.post('/notify', sendNotification);

module.exports = router;
