const Booking = require('../models/Booking');
const Event = require('../models/Event');

// @desc    Book tickets for an event
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { eventId, ticketCount = 1 } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if event is upcoming
    if (event.status !== 'upcoming') {
      return res.status(400).json({
        success: false,
        message: 'Cannot book tickets for this event - it is not upcoming',
      });
    }

    // Check capacity
    if (event.registeredCount + ticketCount > event.capacity) {
      return res.status(400).json({
        success: false,
        message: `Only ${event.capacity - event.registeredCount} spots remaining`,
      });
    }

    // Check for existing booking
    const existingBooking = await Booking.findOne({
      event: eventId,
      user: req.user._id,
      status: { $ne: 'cancelled' },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You have already booked this event',
      });
    }

    // Create booking
    const booking = await Booking.create({
      event: eventId,
      user: req.user._id,
      ticketCount,
      totalPrice: event.price * ticketCount,
    });

    // Update event registered count
    event.registeredCount += ticketCount;
    await event.save();

    // Populate booking
    await booking.populate([
      { path: 'event', select: 'title date time location image price' },
      { path: 'user', select: 'name email' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { user: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate({
          path: 'event',
          select: 'title date time location image price status category organizer',
          populate: { path: 'organizer', select: 'name' },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Booking.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: bookings,
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

// @desc    Get bookings for an event (organizer view)
// @route   GET /api/bookings/event/:eventId
// @access  Private (organizer, admin)
exports.getEventBookings = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);

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
        message: 'Not authorized to view these bookings',
      });
    }

    let bookings = await Booking.find({ event: req.params.eventId })
      .populate('user', 'name email phone avatar role')
      .sort({ createdAt: -1 });

    // Hide admins from organizers and typical users
    if (req.user.role === 'organizer') {
      bookings = bookings.filter((b) => b.user && b.user.role !== 'admin');
    }

    res.status(200).json({
      success: true,
      data: bookings,
      total: bookings.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check ownership
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Update event registered count
    await Event.findByIdAndUpdate(booking.event, {
      $inc: { registeredCount: -booking.ticketCount },
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};
