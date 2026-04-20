const express = require('express');
const {
  getUsers,
  updateUserRole,
  deleteUser,
  getStats,
  getOrganizerStats,
} = require('../controllers/adminController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');

const router = express.Router();

// Admin only
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.get('/stats', protect, authorize('admin'), getStats);

// Organizer stats
router.get(
  '/organizer-stats',
  protect,
  authorize('organizer', 'admin'),
  getOrganizerStats
);

module.exports = router;
