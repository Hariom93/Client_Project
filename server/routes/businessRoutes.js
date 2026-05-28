const express = require('express');
const router = express.Router();
const {
  getBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  addReview
} = require('../controllers/businessController');
const { protect } = require('../middleware/auth');

router.get('/', getBusinesses);
router.get('/:id', getBusinessById);
router.post('/', protect, createBusiness);
router.put('/:id', protect, updateBusiness);
router.delete('/:id', protect, deleteBusiness);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
