import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { detectEmotion, generateTherapySuggestions, getActivityRecommendations } from '../utils/emotionDetection';
import { getFoodRecommendations, getSocialMediaSuggestions, getTravelRecommendations } from '../utils/recommendations';
import MoodCard from './MoodCard';
import RecommendationCard from './RecommendationCard';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const messagesEndRef = useRef(null);
  const { currentUser, userProfile } = useAuth();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue('');
    setLoading(true);

    try {
      // Add user message to chat
      setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);

      // Detect emotion
      const emotionData = detectEmotion(userMessage);
      setCurrentMood(emotionData);

      // Get therapy suggestions
      const therapySuggestions = generateTherapySuggestions(emotionData.emotion);
      const activities = getActivityRecommendations(emotionData.emotion, emotionData.mood);

      // Get personalized recommendations
      const foodRec = userProfile?.interests?.food?.length > 0
        ? getFoodRecommendations(emotionData.emotion, userProfile.interests.food[0])
        : [];
      const socialMediaRec = userProfile?.interests?.socialMedia?.length > 0
        ? getSocialMediaSuggestions(emotionData.emotion, userProfile.interests.socialMedia)
        : [];
      const travelRec = userProfile?.interests?.travel?.length > 0
        ? getTravelRecommendations(emotionData.emotion, userProfile.interests.travel[0])
        : null;

      // Construct bot response
      const botResponse = `
🌟 I sense you're feeling ${emotionData.emotion.toUpperCase()}.

💡 Here's what I'd suggest:
${therapySuggestions.slice(0, 2).map(s => s).join('\n')}

🎯 Activities for you:
${activities.slice(0, 2).map(a => a).join('\n')}
      `.trim();

      // Add bot message
      setMessages(prev => [...prev, {
        role: 'bot',
        content: botResponse,
        mood: emotionData,
        recommendations: {
          food: foodRec,
          socialMedia: socialMediaRec,
          travel: travelRec
        },
        timestamp: new Date()
      }]);

      // Save to Firestore
      console.log('💾 Saving to Firestore:', {
        userId: currentUser.uid,
        userMessage: userMessage,
        emotion: emotionData.emotion,
        confidence: emotionData.confidence
      });

      const docRef = await addDoc(collection(db, 'mood_history'), {
        userId: currentUser.uid,
        messageType: 'text',
        userMessage: userMessage,
        detectedEmotion: emotionData.emotion,
        moodCategory: emotionData.mood,
        confidenceScore: emotionData.confidence,
        therapyResponse: botResponse,
        recommendations: {
          food: foodRec,
          socialMedia: socialMediaRec,
          travel: travelRec ? travelRec.places : []
        },
        timestamp: serverTimestamp()
      });

      console.log('✅ Mood history saved successfully:', docRef.id);

    } catch (error) {
      console.error('❌ Error sending message:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Current Mood */}
      {currentMood && (
        <div className="mb-6">
          <MoodCard mood={currentMood} />
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-lg p-6 mb-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to MindFlow Chat</h2>
              <p className="text-gray-600">Share your thoughts and emotions, and I'll help you feel better.</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {msg.timestamp?.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Recommendations */}
      {messages.length > 0 && messages[messages.length - 1].role === 'bot' && messages[messages.length - 1].recommendations && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {messages[messages.length - 1].recommendations.food.length > 0 && (
            <RecommendationCard
              title="🍽️ Food"
              items={messages[messages.length - 1].recommendations.food}
            />
          )}
          {messages[messages.length - 1].recommendations.socialMedia.length > 0 && (
            <RecommendationCard
              title="📱 Social Media"
              items={messages[messages.length - 1].recommendations.socialMedia}
            />
          )}
          {messages[messages.length - 1].recommendations.travel && (
            <RecommendationCard
              title="✈️ Travel"
              items={messages[messages.length - 1].recommendations.travel.places}
            />
          )}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Tell me how you're feeling..."
          className="input-field flex-1"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
