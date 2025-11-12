// routes/review.js
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const mongoose = require('mongoose');

// GET: /reviews/top-rated?limit=10
router.get('/top-rated', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10; // default top 10

    // Optimized aggregation pipeline: $group, $sort, $limit, efficient indexes
    const pipeline = [
      {
        $group: {
          _id: '$productId',
          avgRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      },
      {
        $sort: { avgRating: -1, reviewCount: -1 } // sort by avgRating, then by number of reviews
      },
      { $limit: limit },
      {
        // Optionally populate product details
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      {
        $unwind: '$productInfo'
      },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          avgRating: 1,
          reviewCount: 1,
          productName: '$productInfo.name'
          // add other product fields as needed
        }
      }
    ];

    const results = await Review.aggregate(pipeline).allowDiskUse(true);
    res.json({ topRated: results });
  } catch (err) {
    // Robust error handling
    next(err);
  }
});

module.exports = router;
