import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function DebugConsole() {
  const { currentUser, isMockMode } = useAuth();
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { 
      message, 
      type, 
      timestamp: new Date().toLocaleTimeString() 
    }]);
  };

  const checkFirebaseStatus = async () => {
    addLog('🔍 Checking Firebase Status...', 'info');
    
    try {
      if (!currentUser) {
        addLog('❌ No user logged in', 'error');
        return;
      }
      
      addLog(`✅ Current User: ${currentUser.email} (${currentUser.uid})`, 'success');
      addLog(`🎭 Mock Mode: ${isMockMode ? 'YES' : 'NO'}`, 'info');
      
      if (isMockMode) {
        addLog('⚠️ Running in Mock Auth Mode - data may not persist to Firestore', 'warning');
        return;
      }

      // Try to query mood_history
      addLog('📊 Querying mood_history collection...', 'info');
      const q = query(
        collection(db, 'mood_history'),
        where('userId', '==', currentUser.uid)
      );
      
      const snapshot = await getDocs(q);
      addLog(`✅ Found ${snapshot.size} mood history records`, 'success');
      
      let total = 0, totalConfidence = 0;
      snapshot.docs.forEach(doc => {
        total++;
        totalConfidence += doc.data().confidenceScore || 0;
        addLog(`📄 Doc: ${doc.data().detectedEmotion} - "${doc.data().userMessage?.substring(0, 30)}..."`, 'info');
      });
      
      if (snapshot.size > 0) {
        addLog(`📊 Stats: ${snapshot.size} messages, Avg Confidence: ${(totalConfidence/snapshot.size*100).toFixed(1)}%`, 'success');
      }
    } catch (error) {
      addLog(`❌ Error: ${error.code} - ${error.message}`, 'error');
    }
  };

  const checkFirestoreRules = async () => {
    addLog('🔐 Checking Firestore Permissions...', 'info');
    
    try {
      const testRef = collection(db, 'test_permissions');
      const snapshot = await getDocs(testRef);
      addLog('✅ Read permissions OK', 'success');
    } catch (error) {
      if (error.code === 'permission-denied') {
        addLog('❌ Permission Denied - Check Firestore Security Rules', 'error');
        addLog('Go to Firebase Console → Firestore Database → Rules tab', 'info');
      } else {
        addLog(`⚠️ ${error.code}: ${error.message}`, 'warning');
      }
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-gray-900 text-white rounded-lg shadow-2xl border border-gray-700 flex flex-col">
      <div className="bg-gray-800 px-4 py-3 font-bold text-sm flex justify-between items-center border-b border-gray-700">
        <span>🔧 Debug Console</span>
        <button
          onClick={clearLogs}
          className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 rounded"
        >
          Clear
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto text-xs font-mono space-y-1 p-3">
        {logs.length === 0 ? (
          <div className="text-gray-400">No logs yet. Click buttons to run checks...</div>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className={`
              ${log.type === 'success' ? 'text-green-400' : ''}
              ${log.type === 'error' ? 'text-red-400' : ''}
              ${log.type === 'warning' ? 'text-yellow-400' : ''}
              ${log.type === 'info' ? 'text-blue-400' : ''}
            `}>
              <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
            </div>
          ))
        )}
      </div>

      <div className="bg-gray-800 px-4 py-3 border-t border-gray-700 grid grid-cols-2 gap-2">
        <button
          onClick={checkFirebaseStatus}
          className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Check Firebase
        </button>
        <button
          onClick={checkFirestoreRules}
          className="text-xs px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded"
        >
          Check Perms
        </button>
      </div>
    </div>
  );
}
