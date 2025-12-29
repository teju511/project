import React, { useState } from 'react';
import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';

export default function FirebaseDebug() {
  const [testError, setTestError] = useState(null);
  const [testSuccess, setTestSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(true);
  const { isMockMode, currentUser } = useAuth();

  const handleTestSignup = async () => {
    setLoading(true);
    setTestError(null);
    setTestSuccess(null);

    try {
      const testEmail = `test_${Date.now()}@example.com`;
      const testPassword = 'TestPassword123!';
      
      console.log('Testing Firebase signup...');
      const result = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      setTestSuccess(`✓ Test signup successful! UID: ${result.user.uid}`);
      console.log('Signup success:', result.user.uid);
    } catch (error) {
      console.error('Signup error:', error);
      setTestError(`✗ ${error.code}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTestMood = async () => {
    setLoading(true);
    setTestError(null);
    setTestSuccess(null);

    try {
      if (!currentUser) {
        setTestError('❌ No user logged in');
        setLoading(false);
        return;
      }

      console.log('🧪 Creating test mood record...');
      const docRef = await addDoc(collection(db, 'mood_history'), {
        userId: currentUser.uid,
        messageType: 'test',
        userMessage: 'Test message - ' + new Date().toLocaleString(),
        detectedEmotion: 'happy',
        moodCategory: 'positive',
        confidenceScore: 0.95,
        therapyResponse: 'This is a test response',
        recommendations: {
          food: [],
          socialMedia: [],
          travel: []
        },
        timestamp: serverTimestamp()
      });

      setTestSuccess(`✓ Test mood created! ID: ${docRef.id}`);
      console.log('✅ Test document created:', docRef.id);
    } catch (error) {
      console.error('Error creating test mood:', error);
      setTestError(`✗ ${error.code}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckMoodHistory = async () => {
    setLoading(true);
    setTestError(null);
    setTestSuccess(null);

    try {
      if (!currentUser) {
        setTestError('❌ No user logged in');
        setLoading(false);
        return;
      }

      console.log('📊 Checking mood history for user:', currentUser.uid);
      const q = query(collection(db, 'mood_history'), where('userId', '==', currentUser.uid));
      const snapshot = await getDocs(q);
      
      console.log('✅ Found documents:', snapshot.size);
      
      if (snapshot.size === 0) {
        setTestSuccess('⚠️ No mood history found yet. Send a message to create one!');
      } else {
        const emotions = [];
        snapshot.docs.forEach(doc => {
          emotions.push(doc.data().detectedEmotion);
        });
        setTestSuccess(`✓ Found ${snapshot.size} records. Emotions: ${emotions.join(', ')}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setTestError(`✗ ${error.code}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 z-50 bg-red-500 text-white px-3 py-2 rounded text-xs font-bold hover:bg-red-600"
      >
        🔴 Firebase Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-gray-900 text-white border-2 border-red-500 rounded-lg shadow-2xl p-4 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-red-500">
        <h2 className="text-lg font-bold text-red-400">🔧 Firebase Debug</h2>
        <button onClick={() => setShowDebug(false)} className="text-red-400 text-2xl font-bold cursor-pointer hover:text-red-300">✕</button>
      </div>

      <div className="mb-4 text-xs">
        <h3 className="text-yellow-400 font-bold mb-2">Firebase Config:</h3>
        <div className="bg-gray-800 p-2 rounded font-mono space-y-1 text-gray-300">
          <p><span className="text-cyan-400">projectId:</span></p>
          <p className="text-green-400 break-words text-xs">{auth?.app?.options?.projectId || '❌'}</p>
          <p><span className="text-cyan-400">authDomain:</span></p>
          <p className="text-green-400 break-words text-xs">{auth?.app?.options?.authDomain || '❌'}</p>
          <p><span className="text-cyan-400">apiKey:</span> {auth?.app?.options?.apiKey ? '✓' : '❌'}</p>
        </div>
      </div>

      <div className="mb-3 p-2 bg-blue-900 border border-blue-500 rounded text-xs">
        {isMockMode ? (
          <p className="text-blue-200">🎭 <span className="font-bold">Mock Auth Mode Active</span><br/>Firebase Email/Password is disabled. Using local mock auth for testing.</p>
        ) : (
          <p className="text-blue-200">✓ <span className="font-bold">Using Real Firebase</span></p>
        )}
      </div>

      <button
        onClick={handleTestSignup}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 px-3 rounded text-xs mb-2 cursor-pointer transition"
      >
        {loading ? '⏳ Testing Signup...' : '🧪 Test Signup'}
      </button>

      <button
        onClick={handleCheckMoodHistory}
        disabled={loading || !currentUser}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-2 px-3 rounded text-xs mb-2 cursor-pointer transition"
      >
        {loading ? '⏳ Checking...' : '📊 Check Mood History'}
      </button>

      <button
        onClick={handleCreateTestMood}
        disabled={loading || !currentUser}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-2 px-3 rounded text-xs mb-3 cursor-pointer transition"
      >
        {loading ? '⏳ Creating...' : '➕ Create Test Mood'}
      </button>

      {testSuccess && (
        <div className="p-2 bg-green-900 text-green-200 rounded text-xs mb-2 border border-green-500">
          {testSuccess}
        </div>
      )}
      {testError && (
        <div className="p-2 bg-red-900 text-red-200 rounded text-xs border border-red-500 overflow-x-auto">
          {testError}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-2 text-center">Check browser console (F12) for detailed logs</p>
    </div>
  );
}
