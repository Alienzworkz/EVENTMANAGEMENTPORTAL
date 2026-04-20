const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['conference', 'workshop', 'seminar', 'concert', 'sports', 'networking', 'other'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    endDate: {
      type: Date,
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    venue: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for checking if event is full
eventSchema.virtual('isFull').get(function () {
  return this.registeredCount >= this.capacity;
});

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function () {
  return Math.max(0, this.capacity - this.registeredCount);
});

// Index for search
eventSchema.index({ title: 'text', description: 'text', location: 'text' });
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ organizer: 1 });

module.exports = mongoose.model('Event', eventSchema);
