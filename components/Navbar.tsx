// components/Navbar.tsx
import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Freemanage
        </Link>
        <div className="space-x-4">
          <Link href="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
          <Link href="/clients" className="hover:text-gray-300">
            Clients
          </Link>
          <Link href="/projects" className="hover:text-gray-300">
            Projects
          </Link>
          <Link href="/invoices" className="hover:text-gray-300">
            Invoices
          </Link>
          <Link href="/time-tracker" className="hover:text-gray-300">
            Time Tracker
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
