const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Food', 'Books', 'Home', 'Sports', 'Other']
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/300'
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalVotes: {
    type: Number,
    default: 0
  },
  sentimentScore: {
    type: Number,
    default: 0
  },
  sentimentBreakdown: {
    positive: { type: Number, default: 0 },
    negative: { type: Number, default: 0 },
    neutral: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
