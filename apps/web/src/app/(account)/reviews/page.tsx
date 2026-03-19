import React from 'react';

export default function ReviewsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Reviews</h1>
      <p className="text-gray-600 mb-2">Here you can view and respond to customer reviews.</p>
      {/* Placeholder for reviews list */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Recent Reviews</h2>
        {/* Mock data for reviews */}
        <ul>
          <li className="border-b py-2">
            <strong>John Doe:</strong> Great service and delicious food!
          </li>
          <li className="border-b py-2">
            <strong>Jane Smith:</strong> The catering was perfect for our event.
          </li>
          <li className="border-b py-2">
            <strong>Emily Johnson:</strong> Highly recommend for any occasion!
          </li>
        </ul>
      </div>
    </div>
  );
}