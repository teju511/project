import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function InterestPage() {
  const [selectedInterests, setSelectedInterests] = useState({
    socialMedia: [],
    travel: [],
    food: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const interests = {
    socialMedia: [
      { id: 'instagram', label: '📷 Instagram', color: 'from-pink-500 to-red-500' },
      { id: 'facebook', label: '👥 Facebook', color: 'from-blue-600 to-blue-800' },
      { id: 'youtube', label: '🎬 YouTube', color: 'from-red-600 to-red-800' }
    ],
    travel: [
      { id: 'temple', label: '🏛️ Temple', color: 'from-orange-500 to-yellow-600' },
      { id: 'park', label: '🌳 Park', color: 'from-green-500 to-teal-600' }
    ],
    food: [
      { id: 'veg', label: '🥗 Vegetarian', color: 'from-lime-500 to-green-600' },
      { id: 'nonveg', label: '🍗 Non-Vegetarian', color: 'from-amber-600 to-orange-600' },
      { id: 'chat', label: '☕ Beverages', color: 'from-yellow-600 to-amber-700' }
    ]
  };

  const toggleInterest = (category, id) => {
    setSelectedInterests(prev => {
      const updated = { ...prev };
      if (updated[category].includes(id)) {
        updated[category] = updated[category].filter(item => item !== id);
      } else {
        updated[category] = [...updated[category], id];
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const totalSelected = 
        selectedInterests.socialMedia.length + 
        selectedInterests.travel.length + 
        selectedInterests.food.length;

      if (totalSelected === 0) {
        throw new Error('Please select at least one interest from each category');
      }

      // Update user profile in Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), {
        interests: selectedInterests,
        interestSelectedAt: new Date()
      });

      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Let's Personalize Your Experience</h1>
          <p className="text-gray-600 text-lg">Select your interests to get tailored recommendations</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded max-w-2xl mx-auto">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Social Media Interests */}
          <div className="card max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📱 Social Media Interests</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {interests.socialMedia.map(interest => (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => toggleInterest('socialMedia', interest.id)}
                  className={`p-6 rounded-xl transition-all transform hover:scale-105 ${
                    selectedInterests.socialMedia.includes(interest.id)
                      ? `bg-gradient-to-r ${interest.color} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-3xl mb-2">{interest.label.split(' ')[0]}</div>
                  <div className="font-semibold">{interest.label.split(' ').slice(1).join(' ')}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Travel Interests */}
          <div className="card max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">✈️ Travel Interests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interests.travel.map(interest => (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => toggleInterest('travel', interest.id)}
                  className={`p-6 rounded-xl transition-all transform hover:scale-105 ${
                    selectedInterests.travel.includes(interest.id)
                      ? `bg-gradient-to-r ${interest.color} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-3xl mb-2">{interest.label.split(' ')[0]}</div>
                  <div className="font-semibold">{interest.label.split(' ').slice(1).join(' ')}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Food Interests */}
          <div className="card max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🍽️ Food Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {interests.food.map(interest => (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => toggleInterest('food', interest.id)}
                  className={`p-6 rounded-xl transition-all transform hover:scale-105 ${
                    selectedInterests.food.includes(interest.id)
                      ? `bg-gradient-to-r ${interest.color} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-3xl mb-2">{interest.label.split(' ')[0]}</div>
                  <div className="font-semibold">{interest.label.split(' ').slice(1).join(' ')}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center max-w-4xl mx-auto">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-lg px-8 py-3 disabled:opacity-50"
            >
              {loading ? 'Setting up your profile...' : 'Continue to Home'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
