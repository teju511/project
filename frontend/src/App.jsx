import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';
import FirebaseDebug from './components/FirebaseDebug';

// Pages
import SignPage from './pages/SignPage';
import InterestPage from './pages/InterestPage';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return currentUser ? children : <Navigate to="/" />;
}

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={currentUser ? <Navigate to="/home" /> : <SignPage />} />
      
      {/* Protected Routes */}
      <Route
        path="/interests"
        element={
          <ProtectedRoute>
            <InterestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <FirebaseDebug />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
