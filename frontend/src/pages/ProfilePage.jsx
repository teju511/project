import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
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
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl text-white">
              {userProfile?.displayName?.charAt(0).toUpperCase() || '👤'}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{userProfile?.displayName}</h2>
              <p className="text-gray-600">{currentUser?.email}</p>
              <p className="text-sm text-gray-500">
                Member since {userProfile?.createdAt ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
          >
            Logout
          </button>
        </div>

        {/* Interests Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Interests</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span>📱</span> Social Media
              </h3>
              {userProfile?.interests?.socialMedia?.length > 0 ? (
                <div className="space-y-2">
                  {userProfile.interests.socialMedia.map((item) => (
                    <div
                      key={item}
                      className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg capitalize"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No preferences selected</p>
              )}
            </div>

            {/* Travel */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span>✈️</span> Travel
              </h3>
              {userProfile?.interests?.travel?.length > 0 ? (
                <div className="space-y-2">
                  {userProfile.interests.travel.map((item) => (
                    <div
                      key={item}
                      className="px-3 py-2 bg-green-100 text-green-800 rounded-lg capitalize"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No preferences selected</p>
              )}
            </div>

            {/* Food */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span>🍽️</span> Food
              </h3>
              {userProfile?.interests?.food?.length > 0 ? (
                <div className="space-y-2">
                  {userProfile.interests.food.map((item) => (
                    <div
                      key={item}
                      className="px-3 py-2 bg-orange-100 text-orange-800 rounded-lg capitalize"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No preferences selected</p>
              )}
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <p className="text-gray-600 text-sm">Receive mood check-in reminders</p>
              </div>
              <input type="checkbox" className="w-5 h-5" defaultChecked />
            </div>
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h3 className="font-semibold text-gray-800">Data Privacy</h3>
                <p className="text-gray-600 text-sm">Keep your mood data private</p>
              </div>
              <input type="checkbox" className="w-5 h-5" defaultChecked />
            </div>
            <div className="flex items-center justify-between py-4">
              <div>
                <h3 className="font-semibold text-gray-800">Dark Mode</h3>
                <p className="text-gray-600 text-sm">Coming soon</p>
              </div>
              <input type="checkbox" className="w-5 h-5" disabled />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
