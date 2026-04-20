const { validationResult } = require('express-validator');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

// @desc    Get all events (public, with search/filter/pagination)
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      status,
      minPrice,
      maxPrice,
      sortBy = 'date',
      order = 'asc',
    } = req.query;

    const query = { isApproved: true };

    // Search by title, description, location
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    const [events, total] = await Promise.all([
      Event.find(query)
        .populate('organizer', 'name email avatar')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(Number(limit)),
      Event.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: events,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total,
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'organizer',
      'name email avatar bio'
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private (organizer, admin)
exports.createEvent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    req.body.organizer = req.user._id;

    const event = await Event.create(req.body);
    await event.populate('organizer', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (owner or admin)
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check ownership (unless admin)
    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('organizer', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (owner or admin)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check ownership (unless admin)
    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event',
      });
    }

    // Delete associated bookings
    await Booking.deleteMany({ event: event._id });
    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get organizer's own events
// @route   GET /api/events/organizer/my-events
// @access  Private (organizer)
exports.getMyEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { organizer: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [events, total] = await Promise.all([
      Event.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Event.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: events,
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

// @desc    Approve/Reject event
// @route   PUT /api/events/:id/approve
// @access  Private (admin only)
exports.approveEvent = async (req, res, next) => {
  try {
    const { isApproved } = req.body;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    ).populate('organizer', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Event ${isApproved ? 'approved' : 'rejected'} successfully`,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events (admin - includes unapproved)
// @route   GET /api/events/admin/all
// @access  Private (admin)
exports.getAllEventsAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status, isApproved } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'all') query.status = status;
    if (isApproved !== undefined) query.isApproved = isApproved === 'true';

    const skip = (Number(page) - 1) * Number(limit);

    const [events, total] = await Promise.all([
      Event.find(query)
        .populate('organizer', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Event.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: events,
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
