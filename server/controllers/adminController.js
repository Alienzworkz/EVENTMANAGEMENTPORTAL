const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin)
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (admin)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['attendee', 'organizer', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    // Delete user's events and bookings
    await Event.deleteMany({ organizer: user._id });
    await Booking.deleteMany({ user: user._id });
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system analytics
// @route   GET /api/admin/stats
// @access  Private (admin)
exports.getStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalEvents,
      totalBookings,
      usersByRole,
      eventsByCategory,
      eventsByStatus,
      recentBookings,
      recentUsers,
      monthlyBookings,
    ] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Booking.countDocuments({ status: 'confirmed' }),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
      ]),
      Event.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
      Event.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Booking.find({ status: 'confirmed' })
        .populate('user', 'name email')
        .populate('event', 'title date')
        .sort({ createdAt: -1 })
        .limit(5),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email role createdAt'),
      Booking.aggregate([
        { $match: { status: 'confirmed' } },
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' },
            },
            count: { $sum: 1 },
            revenue: { $sum: '$totalPrice' },
          },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 },
      ]),
    ]);

    // Calculate total revenue
    const revenueResult = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalEvents,
        totalBookings,
        totalRevenue,
        usersByRole,
        eventsByCategory,
        eventsByStatus,
        recentBookings,
        recentUsers,
        monthlyBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get organizer stats (for organizer dashboard)
// @route   GET /api/admin/organizer-stats
// @access  Private (organizer)
exports.getOrganizerStats = async (req, res, next) => {
  try {
    const organizerId = req.user._id;

    const events = await Event.find({ organizer: organizerId });
    const eventIds = events.map((e) => e._id);

    const [totalBookings, recentBookings] = await Promise.all([
      Booking.countDocuments({ event: { $in: eventIds }, status: 'confirmed' }),
      Booking.find({ event: { $in: eventIds }, status: 'confirmed' })
        .populate('user', 'name email')
        .populate('event', 'title')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const revenueResult = await Booking.aggregate([
      { $match: { event: { $in: eventIds }, status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const eventsByStatus = await Event.aggregate([
      { $match: { organizer: organizerId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEvents: events.length,
        totalBookings,
        totalRevenue,
        totalAttendees: events.reduce((sum, e) => sum + e.registeredCount, 0),
        eventsByStatus,
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};
