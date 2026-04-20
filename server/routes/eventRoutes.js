const express = require('express');
const { body } = require('express-validator');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  approveEvent,
  getAllEventsAdmin,
} = require('../controllers/eventController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/organizer/my-events', protect, authorize('organizer', 'admin'), getMyEvents);
router.get('/admin/all', protect, authorize('admin'), getAllEventsAdmin);
router.get('/:id', getEvent);

// Protected routes
router.post(
  '/',
  protect,
  authorize('organizer', 'admin'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('time').notEmpty().withMessage('Time is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('capacity')
      .isInt({ min: 1 })
      .withMessage('Capacity must be at least 1'),
  ],
  createEvent
);

router.put('/:id', protect, authorize('organizer', 'admin'), updateEvent);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);
router.put('/:id/approve', protect, authorize('admin'), approveEvent);

module.exports = router;
