'use client';

import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Total Earnings (This Month)</h2>
          <p className="text-gray-600 text-2xl">$0.00</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Active Projects</h2>
          <p className="text-gray-600 text-2xl">0</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Upcoming Deadlines</h2>
          <p className="text-gray-600 text-2xl">None</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Payment Notifications</h2>
          <p className="text-gray-600 text-2xl">None</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
