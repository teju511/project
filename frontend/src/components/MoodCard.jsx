import React from 'react';

export default function MoodCard({ mood }) {
  const getEmotionColor = (emotion) => {
    const colors = {
      happy: 'from-yellow-400 to-orange-400',
      sad: 'from-blue-400 to-indigo-400',
      anxious: 'from-orange-400 to-red-400',
      angry: 'from-red-500 to-pink-500',
      calm: 'from-green-400 to-teal-400',
      confused: 'from-purple-400 to-pink-400',
      neutral: 'from-gray-400 to-gray-500'
    };
    return colors[emotion] || colors.neutral;
  };

  const getEmotionEmoji = (emotion) => {
    const emojis = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      angry: '😠',
      calm: '😌',
      confused: '🤔',
      neutral: '😐'
    };
    return emojis[emotion] || '😐';
  };

  return (
    <div className={`bg-gradient-to-r ${getEmotionColor(mood.emotion)} rounded-xl shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">Detected Emotion</p>
          <h3 className="text-3xl font-bold capitalize flex items-center gap-2">
            <span>{getEmotionEmoji(mood.emotion)}</span>
            {mood.emotion}
          </h3>
          <p className="text-sm opacity-90 mt-2">
            Mood: <span className="font-semibold capitalize">{mood.mood}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-90">Confidence</p>
          <p className="text-4xl font-bold">{(mood.confidence * 100).toFixed(0)}%</p>
        </div>
      </div>
      <div className="mt-4 w-full bg-white bg-opacity-20 rounded-full h-2">
        <div
          className="bg-white rounded-full h-2"
          style={{ width: `${mood.confidence * 100}%` }}
        />
      </div>
    </div>
  );
}
