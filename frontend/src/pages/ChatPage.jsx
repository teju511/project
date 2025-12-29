import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Chatbot from '../components/Chatbot';
import VoiceRecognition from '../components/VoiceRecognition';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const [useVoice, setUseVoice] = useState(searchParams.get('voice') === 'true');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/');
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">MindFlow Chat</h1>
            <p className="text-gray-600 text-sm">{useVoice ? '🎤 Voice Mode' : '💬 Text Mode'}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setUseVoice(false)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                !useVoice
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              💬 Text
            </button>
            <button
              onClick={() => setUseVoice(true)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                useVoice
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🎤 Voice
            </button>
            <button
              onClick={() => navigate('/home')}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 flex flex-col max-w-5xl w-full mx-auto px-4 py-6">
        {useVoice ? (
          <VoiceRecognition />
        ) : (
          <Chatbot />
        )}
      </div>
    </div>
  );
}
