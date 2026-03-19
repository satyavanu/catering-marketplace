import React from 'react';

export default function SavedCaterersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Saved Caterers</h1>
      <p className="text-gray-600">Here you can view and manage your favorite caterers.</p>
      {/* Placeholder for saved caterers list */}
      <ul className="mt-4">
        {/* Example of saved caterer item */}
        <li className="border-b py-2">
          <span className="font-semibold">Caterer Name</span> - <span className="text-gray-500">Cuisine Type</span>
        </li>
        {/* Add more saved caterers here */}
      </ul>
    </div>
  );
}