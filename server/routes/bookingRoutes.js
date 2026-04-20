const express = require('express');
const {
  createBooking,
  getMyBookings,
  getEventBookings,
  cancelBooking,
} = require('../controllers/bookingController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get(
  '/event/:eventId',
  protect,
  authorize('organizer', 'admin'),
  getEventBookings
);
router.delete('/:id', protect, cancelBooking);

module.exports = router;
