import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            MindFlow
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">{userProfile?.displayName}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome, {userProfile?.displayName}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Let's explore your mood and get personalized recommendations
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Chatbot Card */}
          <Link to="/chat" className="card transform hover:scale-105 transition-transform">
            <div className="text-5xl mb-4">🤖</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Chatbot</h2>
            <p className="text-gray-600 mb-4">
              Talk to our AI therapist about your emotions and get personalized suggestions.
            </p>
            <div className="text-blue-500 font-semibold">Start Chat →</div>
          </Link>

          {/* Voice Recognition Card */}
          <Link to="/chat?voice=true" className="card transform hover:scale-105 transition-transform">
            <div className="text-5xl mb-4">🎤</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Voice Recognition</h2>
            <p className="text-gray-600 mb-4">
              Speak your thoughts and let our AI detect your mood through voice.
            </p>
            <div className="text-blue-500 font-semibold">Use Voice →</div>
          </Link>

          {/* Mood History Card */}
          <Link to="/history" className="card transform hover:scale-105 transition-transform">
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Mood History</h2>
            <p className="text-gray-600 mb-4">
              View your mood trends, insights, and past conversations.
            </p>
            <div className="text-blue-500 font-semibold">View History →</div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Selected Interests</h3>
              <div className="space-y-2">
                {userProfile?.interests?.socialMedia?.length > 0 && (
                  <p className="text-gray-600">
                    <span className="font-semibold">Social Media:</span> {userProfile.interests.socialMedia.join(', ')}
                  </p>
                )}
                {userProfile?.interests?.travel?.length > 0 && (
                  <p className="text-gray-600">
                    <span className="font-semibold">Travel:</span> {userProfile.interests.travel.join(', ')}
                  </p>
                )}
                {userProfile?.interests?.food?.length > 0 && (
                  <p className="text-gray-600">
                    <span className="font-semibold">Food:</span> {userProfile.interests.food.join(', ')}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link to="/chat" className="block btn-primary text-center">
                  Start Chatting
                </Link>
                <Link to="/profile" className="block btn-secondary text-center">
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">💡 Tips for Better Mental Health</h2>
          <ul className="space-y-2 text-blue-700">
            <li>✓ Chat with our AI therapist daily to track your mood</li>
            <li>✓ Use voice recognition to express your feelings naturally</li>
            <li>✓ Check your mood history to identify patterns and triggers</li>
            <li>✓ Follow personalized recommendations based on your emotions</li>
            <li>✓ Practice mindfulness and take breaks when needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
