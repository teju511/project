import compromise from 'compromise';

// Emotion detection using compromise.js
export function detectEmotion(text) {
  if (!text || text.trim().length === 0) {
    return {
      mood: 'neutral',
      emotion: 'neutral',
      score: 0,
      confidence: 0.5
    };
  }

  // Emotion keywords mapping
  const emotionKeywords = {
    happy: ['happy', 'joyful', 'excited', 'great', 'wonderful', 'amazing', 'love', 'fantastic', 'brilliant', 'awesome', 'excellent', 'good', 'perfect', 'blessed', 'grateful'],
    sad: ['sad', 'depressed', 'down', 'unhappy', 'miserable', 'heartbroken', 'devastated', 'terrible', 'awful', 'horrible', 'miss', 'lonely', 'alone', 'lost'],
    anxious: ['anxious', 'nervous', 'worried', 'stressed', 'tense', 'panic', 'afraid', 'scared', 'fear', 'restless', 'uneasy', 'overwhelmed'],
    angry: ['angry', 'furious', 'mad', 'rage', 'irritated', 'frustrated', 'annoyed', 'upset', 'bitter', 'resentful'],
    calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'zen', 'content', 'at peace', 'comfortable'],
    confused: ['confused', 'uncertain', 'lost', 'disoriented', 'puzzled', 'bewildered', 'unsure']
  };

  const lowerText = text.toLowerCase();
  let detectedEmotion = 'neutral';
  let maxCount = 0;

  // Count emotion keywords
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    const count = keywords.filter(keyword => lowerText.includes(keyword)).length;
    if (count > maxCount) {
      maxCount = count;
      detectedEmotion = emotion;
    }
  }

  // Map emotions to moods
  const emotionToMood = {
    happy: 'positive',
    sad: 'negative',
    anxious: 'negative',
    angry: 'negative',
    calm: 'positive',
    confused: 'neutral'
  };

  const mood = emotionToMood[detectedEmotion] || 'neutral';
  const confidence = Math.min(0.5 + (maxCount * 0.1), 1);

  return {
    mood,
    emotion: detectedEmotion,
    score: maxCount,
    confidence
  };
}

// Generate therapy suggestions based on emotion
export function generateTherapySuggestions(emotion) {
  const suggestions = {
    happy: [
      '🎉 You\'re in a great mood! Keep this positive energy going.',
      '💝 Consider sharing your joy with someone close to you.',
      '📝 Journal about what made you happy today.',
      '🎵 Listen to your favorite uplifting music.'
    ],
    sad: [
      '💙 It\'s okay to feel sad. Remember, this feeling is temporary.',
      '🤝 Reach out to a friend or family member for support.',
      '🚶 Take a walk in nature to lift your spirits.',
      '📞 Consider talking to a professional counselor.',
      '💪 Remember your strengths and past achievements.'
    ],
    anxious: [
      '🧘 Try deep breathing exercises: 4-7-8 breathing technique.',
      '🚶 Go for a walk to help calm your nervous system.',
      '📝 Write down your worries to get them out of your head.',
      '🎵 Listen to calming music or meditation sounds.',
      '⏰ Break tasks into smaller, manageable steps.'
    ],
    angry: [
      '😤 Your anger is valid, but let\'s work through it together.',
      '💨 Take a break from the situation if possible.',
      '🏃 Do some physical exercise to release tension.',
      '🎨 Channel your energy into a creative activity.',
      '⏸️ Practice the "pause and reflect" technique before reacting.'
    ],
    calm: [
      '😌 You\'re in a peaceful state. Maintain this balance.',
      '🧘 Great time for meditation or mindfulness practice.',
      '📚 Read something inspiring or uplifting.',
      '🎯 Use this clarity to work on important goals.'
    ],
    confused: [
      '🤔 Take time to clarify your thoughts.',
      '📋 Write down what\'s confusing you for clarity.',
      '🗣️ Talk it through with someone you trust.',
      '⏸️ Take a step back before making decisions.'
    ],
    neutral: [
      '😊 You\'re in a balanced state.',
      '🎯 A good time to plan and organize.',
      '📖 Consider trying something new today.'
    ]
  };

  return suggestions[emotion] || suggestions.neutral;
}

// Get activity recommendations based on mood and emotion
export function getActivityRecommendations(emotion, mood) {
  const activities = {
    positive: [
      '🎬 Watch your favorite movie or series',
      '🎮 Play games with friends',
      '🎸 Create music or play an instrument',
      '📸 Take photos and create memories',
      '🌍 Plan a trip or adventure',
      '🍕 Cook a favorite meal',
      '🏃 Go for a fun run or exercise',
      '🎨 Engage in creative hobbies'
    ],
    negative: [
      '🧘 Practice yoga or meditation',
      '📚 Read a comforting book',
      '🛁 Take a relaxing bath',
      '🎵 Listen to soothing music',
      '🌳 Spend time in nature',
      '👥 Call a friend or family member',
      '✏️ Journal your feelings',
      '☕ Make tea and relax'
    ],
    neutral: [
      '📚 Learn something new',
      '🎯 Work on personal goals',
      '🧩 Solve puzzles or brain teasers',
      '📖 Read articles or blogs',
      '🎓 Take an online course',
      '🎪 Explore new hobbies'
    ]
  };

  return activities[mood] || activities.neutral;
}
