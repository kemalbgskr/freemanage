import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">FreeManage</h1>
      </header>
      <main className="p-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/kanban" className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors duration-200 block">
            <h3 className="text-lg font-bold mb-4">Projects</h3>
            <p className="text-gray-400">Manage your projects here.</p>
          </Link>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Clients</h3>
            <p className="text-gray-400">Manage your clients here.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Invoices</h3>
            <p className="text-gray-400">Manage your invoices here.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
