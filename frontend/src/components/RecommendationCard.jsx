import React from 'react';

export default function RecommendationCard({ title, items }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-bold text-gray-800 mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
            <span className="text-lg">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
