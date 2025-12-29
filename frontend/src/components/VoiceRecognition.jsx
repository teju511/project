import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { detectEmotion, generateTherapySuggestions, getActivityRecommendations } from '../utils/emotionDetection';
import { getFoodRecommendations, getSocialMediaSuggestions, getTravelRecommendations } from '../utils/recommendations';
import MoodCard from './MoodCard';
import RecommendationCard from './RecommendationCard';

export default function VoiceRecognition() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMood, setCurrentMood] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { currentUser, userProfile } = useAuth();

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
      console.log('🎤 Voice recognition started');
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript(prev => prev + transcriptSegment);
        } else {
          interimTranscript += transcriptSegment;
        }
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('🎤 Voice recognition ended');
    };

    recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
      let errorMessage = '';
      
      switch(event.error) {
        case 'no-speech':
          errorMessage = '⚠️ No speech detected. Please speak clearly into your microphone and try again.';
          break;
        case 'audio-capture':
          errorMessage = '⚠️ Microphone not found. Please check your microphone permissions and try again.';
          break;
        case 'not-allowed':
          errorMessage = '⚠️ Microphone permission denied. Please allow microphone access in your browser settings.';
          break;
        case 'network':
          errorMessage = '⚠️ Network error. Please check your internet connection.';
          break;
        case 'timeout':
          errorMessage = '⚠️ Listening timeout. Please try speaking again.';
          break;
        default:
          errorMessage = `⚠️ Voice recognition error: ${event.error}. Please try again.`;
      }
      
      setError(errorMessage);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setError('');
      recognitionRef.current.start();
      
      // Set a timeout to stop listening after 10 seconds of silence
      setTimeout(() => {
        if (recognitionRef.current && isListening) {
          console.log('🎤 Auto-stop listening after 10 seconds');
          recognitionRef.current.stop();
        }
      }, 10000);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const speakResponse = (text) => {
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleProcessTranscript = async () => {
    if (!transcript.trim()) return;

    const userMessage = transcript;
    setTranscript('');
    setIsListening(false);

    try {
      // Add user message
      setMessages(prev => [...prev, { role: 'user', content: userMessage, type: 'voice', timestamp: new Date() }]);

      // Detect emotion
      const emotionData = detectEmotion(userMessage);
      setCurrentMood(emotionData);

      // Get suggestions
      const therapySuggestions = generateTherapySuggestions(emotionData.emotion);
      const activities = getActivityRecommendations(emotionData.emotion, emotionData.mood);

      const foodRec = userProfile?.interests?.food?.length > 0
        ? getFoodRecommendations(emotionData.emotion, userProfile.interests.food[0])
        : [];
      const socialMediaRec = userProfile?.interests?.socialMedia?.length > 0
        ? getSocialMediaSuggestions(emotionData.emotion, userProfile.interests.socialMedia)
        : [];
      const travelRec = userProfile?.interests?.travel?.length > 0
        ? getTravelRecommendations(emotionData.emotion, userProfile.interests.travel[0])
        : null;

      // Create response
      const botResponse = `
I sense you're feeling ${emotionData.emotion}.
${therapySuggestions[0]}
Let me suggest: ${activities[0]}
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

      // Speak response
      speakResponse(botResponse);

      // Save to Firestore
      console.log('💾 Saving voice to Firestore:', {
        userId: currentUser.uid,
        userMessage: userMessage,
        emotion: emotionData.emotion,
        confidence: emotionData.confidence
      });

      const docRef = await addDoc(collection(db, 'mood_history'), {
        userId: currentUser.uid,
        messageType: 'voice',
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

      console.log('✅ Voice mood history saved successfully:', docRef.id);

    } catch (error) {
      console.error('❌ Error processing voice:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      setError('Failed to process your voice. Please try again.');
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

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded flex justify-between items-center">
          <div>
            <p className="font-semibold">⚠️ Voice Issue</p>
            <p className="text-sm mt-1">{error}</p>
            <p className="text-xs text-red-600 mt-2">💡 Tips: Ensure microphone is enabled, speak clearly, and check browser permissions.</p>
          </div>
          <button
            onClick={() => {
              setError('');
              setTranscript('');
            }}
            className="ml-4 px-3 py-1 bg-red-500 text-white rounded text-sm font-semibold hover:bg-red-600 whitespace-nowrap"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-lg p-6 mb-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <div className="text-6xl mb-4">🎤</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Voice Chat Ready</h2>
              <p className="text-gray-600">Click the microphone to start speaking.</p>
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

      {/* Voice Input Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {transcript && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Transcribed:</p>
            <p className="text-lg text-gray-800">{transcript}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={startListening}
            disabled={isListening || isSpeaking}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isListening ? '🎤 Listening...' : '🎤 Start Listening'}
          </button>

          <button
            onClick={stopListening}
            disabled={!isListening}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 font-semibold"
          >
            Stop
          </button>

          <button
            onClick={handleProcessTranscript}
            disabled={!transcript.trim() || isSpeaking}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 font-semibold"
          >
            Send
          </button>
        </div>

        {isSpeaking && (
          <p className="text-center text-purple-600 mt-3 animate-pulse">🔊 Speaking response...</p>
        )}
      </div>
    </div>
  );
}
