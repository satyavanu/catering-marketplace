import React from 'react';

export default function MessagesPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <p className="text-gray-600">This is where you can view and manage your messages.</p>
      {/* Placeholder for messages list */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Your Messages</h2>
        <ul className="list-disc list-inside">
          <li>No messages yet.</li>
        </ul>
      </div>
    </div>
  );
}