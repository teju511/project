import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HistoryPage() {
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState('all');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    const fetchHistory = async () => {
      try {
        console.log('📊 Fetching mood history for user:', currentUser.uid);
        
        // First try without orderBy to avoid index issues
        const q = query(
          collection(db, 'mood_history'),
          where('userId', '==', currentUser.uid)
        );

        const snapshot = await getDocs(q);
        console.log('📊 Retrieved documents:', snapshot.size);
        
        const data = snapshot.docs.map(doc => {
          const docData = doc.data();
          console.log('📄 Document:', docData);
          return {
            id: doc.id,
            ...docData
          };
        });

        // Sort client-side to avoid Firestore index issues
        data.sort((a, b) => {
          const timeA = getTimestampDate(a.timestamp);
          const timeB = getTimestampDate(b.timestamp);
          return timeB - timeA;
        });

        console.log('✅ Mood history fetched successfully:', data.length, 'records');
        setMoodHistory(data);
        setFilteredData(data);
      } catch (error) {
        console.error('❌ Error fetching mood history:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentUser, navigate]);

  // Helper function to convert Firestore timestamp to Date
  const getTimestampDate = (timestamp) => {
    if (!timestamp) return new Date(0);
    if (timestamp.toDate) return timestamp.toDate(); // Firestore Timestamp
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000); // Firestore object
    if (typeof timestamp === 'number') return new Date(timestamp); // Milliseconds
    return new Date(timestamp); // String or other Date
  };

  // Emotion color mapping
  const getEmotionColor = (emotion) => {
    const colors = {
      happy: '#10B981',
      sad: '#EF4444',
      anxious: '#F59E0B',
      angry: '#DC2626',
      calm: '#3B82F6',
      confused: '#8B5CF6',
      neutral: '#9CA3AF'
    };
    return colors[emotion] || '#9CA3AF';
  };

  // Calculate statistics
  const stats = {
    totalConversations: moodHistory.length,
    mostCommonEmotion: moodHistory.length > 0
      ? Object.keys(
          moodHistory.reduce((acc, item) => {
            acc[item.detectedEmotion] = (acc[item.detectedEmotion] || 0) + 1;
            return acc;
          }, {})
        ).sort((a, b) => 
          moodHistory.filter(m => m.detectedEmotion === a).length -
          moodHistory.filter(m => m.detectedEmotion === b).length
        )[moodHistory.length - 1]
      : 'N/A',
    averageConfidence: moodHistory.length > 0
      ? (moodHistory.reduce((sum, item) => sum + (item.confidenceScore || 0), 0) / moodHistory.length * 100).toFixed(1)
      : 0
  };

  // Data for charts
  const emotionCounts = Object.entries(
    moodHistory.reduce((acc, item) => {
      acc[item.detectedEmotion] = (acc[item.detectedEmotion] || 0) + 1;
      return acc;
    }, {})
  ).map(([emotion, count]) => ({
    emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
    count,
    fill: getEmotionColor(emotion)
  }));

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Mood History</h1>
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-5xl mb-2">💬</div>
            <h3 className="text-gray-600 font-semibold mb-2">Total Conversations</h3>
            <p className="text-4xl font-bold text-blue-500">{stats.totalConversations}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-5xl mb-2">😊</div>
            <h3 className="text-gray-600 font-semibold mb-2">Most Common Emotion</h3>
            <p className="text-2xl font-bold text-purple-500 capitalize">{stats.mostCommonEmotion}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-5xl mb-2">🎯</div>
            <h3 className="text-gray-600 font-semibold mb-2">Avg. Confidence</h3>
            <p className="text-4xl font-bold text-green-500">{stats.averageConfidence}%</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Emotion Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Emotion Distribution</h2>
            {emotionCounts.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={emotionCounts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="emotion" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-600 text-center py-12">No mood data yet</p>
            )}
          </div>

          {/* Recent Moods Timeline */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Moods</h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {moodHistory.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 capitalize">
                      {item.detectedEmotion}
                    </p>
                    <p className="text-sm text-gray-600">
                      {getTimestampDate(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getEmotionColor(item.detectedEmotion) }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full History Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Full Conversation History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Message</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Emotion</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Confidence</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
                </tr>
              </thead>
              <tbody>
                {moodHistory.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">
                      {getTimestampDate(item.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-xs truncate">
                      {item.userMessage || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-3 py-1 rounded-full text-white font-semibold capitalize text-xs"
                        style={{ backgroundColor: getEmotionColor(item.detectedEmotion) }}
                      >
                        {item.detectedEmotion}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {((item.confidenceScore || 0) * 100).toFixed(0)}%
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {item.messageType === 'voice' ? '🎤' : '💬'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {moodHistory.length === 0 && (
              <p className="text-center text-gray-600 py-8">No mood history yet. Start chatting to create your history!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
