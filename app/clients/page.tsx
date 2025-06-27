'use client';

import React, { useEffect, useState } from 'react';
import { Client } from '../../app/generated/prisma';

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Client[] = await response.json();
        setClients(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) return <p>Loading clients...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Clients</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => (
          <div key={client.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{client.name}</h2>
            {client.email && <p className="text-gray-600">Email: {client.email}</p>}
            {client.phone && <p className="text-gray-600">Phone: {client.phone}</p>}
            {client.company && <p className="text-gray-600">Company: {client.company}</p>}
            {client.country && <p className="text-gray-600">Country: {client.country}</p>}
            {client.notes && <p className="text-gray-600">Notes: {client.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsPage;
