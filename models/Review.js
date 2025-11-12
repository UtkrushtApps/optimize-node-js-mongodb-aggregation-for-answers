// models/Review.js
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true // For faster lookups/grouping & queries
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    index: true // Helpful for aggregation and filter by rating
  },
  comment: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // For recent reviews, optional
  }
});

// Compound index to enable efficient aggregation by product and faster average rating calculation
ReviewSchema.index({ productId: 1, rating: -1 });

module.exports = mongoose.model('Review', ReviewSchema);
