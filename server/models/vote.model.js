const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    required: true
  },
  sentimentScore: {
    type: Number,
    required: true
  },
  ipAddress: {
    type: String,
    default: 'unknown'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vote', voteSchema);