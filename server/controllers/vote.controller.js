const Vote = require('../models/vote.model');
const Product = require('../models/product.model');
const { analyzeSentiment } = require('../services/sentimentAnalyse');

exports.createVote = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Analyze sentiment
    const sentimentAnalysis = analyzeSentiment(comment);

    console.log('Sentiment Analysis Result:', sentimentAnalysis); // Debug log

    // Create vote
    const vote = new Vote({
      productId,
      rating,
      comment,
      sentiment: sentimentAnalysis.sentiment,
      sentimentScore: sentimentAnalysis.score,
      ipAddress: req.ip || 'unknown'
    });

    await vote.save();

    // Update product statistics
    await updateProductStats(productId);

    res.status(201).json({ 
      success: true, 
      data: vote,
      sentimentAnalysis 
    });
  } catch (error) {
    next(error);
  }
};

exports.getVotesByProduct = async (req, res, next) => {
  try {
    const votes = await Vote.find({ productId: req.params.productId })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: votes });
  } catch (error) {
    next(error);
  }
};

exports.getSentimentAnalysis = async (req, res, next) => {
  try {
    const votes = await Vote.find({ productId: req.params.productId });
    
    console.log('Total votes found:', votes.length); // Debug log
    
    const sentimentBreakdown = {
      positive: 0,
      negative: 0,
      neutral: 0
    };

    votes.forEach(vote => {
      console.log('Vote sentiment:', vote.sentiment);
      if (vote.sentiment === 'positive') {
        sentimentBreakdown.positive++;
      } else if (vote.sentiment === 'negative') {
        sentimentBreakdown.negative++;
      } else if (vote.sentiment === 'neutral') {
        sentimentBreakdown.neutral++;
      }
    });

    console.log('Sentiment breakdown:', sentimentBreakdown); 

    const averageSentiment = votes.length > 0
      ? votes.reduce((sum, v) => sum + v.sentimentScore, 0) / votes.length
      : 0;

    res.json({
      success: true,
      data: {
        breakdown: sentimentBreakdown,
        averageSentiment,
        totalVotes: votes.length
      }
    });
  } catch (error) {
    next(error);
  }
};

async function updateProductStats(productId) {
  try {
    const votes = await Vote.find({ productId });
    
    if (votes.length === 0) return;

    const averageRating = votes.reduce((sum, v) => sum + v.rating, 0) / votes.length;
    const averageSentiment = votes.reduce((sum, v) => sum + v.sentimentScore, 0) / votes.length;
    
    const sentimentBreakdown = {
      positive: 0,
      negative: 0,
      neutral: 0
    };

    votes.forEach(vote => {
      if (vote.sentiment === 'positive') {
        sentimentBreakdown.positive++;
      } else if (vote.sentiment === 'negative') {
        sentimentBreakdown.negative++;
      } else if (vote.sentiment === 'neutral') {
        sentimentBreakdown.neutral++;
      }
    });

    console.log('Updating product with breakdown:', sentimentBreakdown);

    await Product.findByIdAndUpdate(productId, {
      averageRating,
      totalVotes: votes.length,
      sentimentScore: averageSentiment,
      sentimentBreakdown: sentimentBreakdown
    });
  } catch (error) {
    console.error('Error updating product stats:', error);
  }
}