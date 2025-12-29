import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8">Sorry, the page you're looking for doesn't exist.</p>
        <Link
          to="/home"
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
