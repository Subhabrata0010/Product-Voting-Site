const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const analyzeSentiment = (text) => {
  const result = sentiment.analyze(text);
  
  console.log('Raw sentiment result:', result);
  
  let sentimentType;
  if (result.score > 1) {
    sentimentType = 'positive';
  } else if (result.score < -1) {
    sentimentType = 'negative';
  } else if (result.score === 0) {
    if (result.positive.length > 0 && result.negative.length === 0) {
      sentimentType = 'positive';
    } else if (result.negative.length > 0 && result.positive.length === 0) {
      sentimentType = 'negative';
    } else {
      sentimentType = 'neutral';
    }
  } else {
    if (result.comparative > 0.1) {
      sentimentType = 'positive';
    } else if (result.comparative < -0.1) {
      sentimentType = 'negative';
    } else {
      sentimentType = 'neutral';
    }
  }

  console.log('Determined sentiment type:', sentimentType);

  return {
    sentiment: sentimentType,
    score: result.score,
    comparative: result.comparative,
    positive: result.positive,
    negative: result.negative
  };
};

module.exports = { analyzeSentiment };