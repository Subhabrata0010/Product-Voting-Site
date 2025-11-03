import { SentimentAnalysis } from '@/lib/api';

interface SentimentDisplayProps {
  sentiment: SentimentAnalysis;
}

export default function SentimentDisplay({ sentiment }: SentimentDisplayProps) {
  console.log('SentimentDisplay received:', sentiment);
  
  const total = sentiment.breakdown.positive + sentiment.breakdown.negative + sentiment.breakdown.neutral;
  
  console.log('Total votes:', total);
  console.log('Breakdown:', sentiment.breakdown);
  
  const getPercentage = (value: number) => total > 0 ? ((value / total) * 100).toFixed(1) : '0';

  return (
    <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-300">
      <h3 className="text-lg font-bold">Sentiment Analysis</h3>
      
      <div className="flex flex-row flex-wrap gap-6 text-xs text-gray-500 mb-4 p-2 bg-white rounded">
        <p>Total: {total}</p>
        <p>Positive: {sentiment.breakdown.positive}</p>
        <p>Negative: {sentiment.breakdown.negative}</p>
        <p>Neutral: {sentiment.breakdown.neutral}</p>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-green-700 font-medium">
              Positive ({sentiment.breakdown.positive})
            </span>
            <span className="text-gray-600">{getPercentage(sentiment.breakdown.positive)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${getPercentage(sentiment.breakdown.positive)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700 font-medium">
              Neutral ({sentiment.breakdown.neutral})
            </span>
            <span className="text-gray-600">{getPercentage(sentiment.breakdown.neutral)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gray-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${getPercentage(sentiment.breakdown.neutral)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-red-700 font-medium">
              Negative ({sentiment.breakdown.negative})
            </span>
            <span className="text-gray-600">{getPercentage(sentiment.breakdown.negative)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-red-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${getPercentage(sentiment.breakdown.negative)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Average Sentiment Score: <span className="font-bold">{sentiment.averageSentiment.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}