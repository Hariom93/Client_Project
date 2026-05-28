const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  updateAttendance
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', protect, admin, createEvent);
router.put('/:id', protect, admin, updateEvent);
router.delete('/:id', protect, admin, deleteEvent);
router.post('/:id/register', protect, registerForEvent);
router.put('/:id/attendance', protect, admin, updateAttendance);

module.exports = router;
