const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validation');
const voteController = require('../controllers/vote.controller');

router.post('/', [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment is required')
    .isLength({ min: 10 }).withMessage('Comment must be at least 10 characters')
], validate, voteController.createVote);

router.get('/:productId', voteController.getVotesByProduct);
router.get('/:productId/sentiment', voteController.getSentimentAnalysis);

module.exports = router;