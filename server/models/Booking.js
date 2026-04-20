const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    ticketCount: {
      type: Number,
      default: 1,
      min: [1, 'Must book at least 1 ticket'],
      max: [10, 'Cannot book more than 10 tickets'],
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'pending'],
      default: 'confirmed',
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate bookings
bookingSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
