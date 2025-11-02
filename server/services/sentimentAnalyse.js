const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const analyzeSentiment = (text) => {
  const result = sentiment.analyze(text);
  
  let sentimentType;
  if (result.score > 0) {
    sentimentType = 'positive';
  } else if (result.score < 0) {
    sentimentType = 'negative';
  } else {
    sentimentType = 'neutral';
  }

  return {
    sentiment: sentimentType,
    score: result.score,
    comparative: result.comparative,
    positive: result.positive,
    negative: result.negative
  };
};

module.exports = { analyzeSentiment };