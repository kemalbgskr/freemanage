'use client';

import React, { useEffect, useState } from 'react';
import { Invoice, Client, Project } from '../../app/generated/prisma';

const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newInvoice, setNewInvoice] = useState({
    invoiceNumber: '',
    issueDate: '',
    dueDate: '',
    amount: '',
    status: 'Draft',
    projectId: '',
    clientId: '',
    items: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoicesResponse, clientsResponse, projectsResponse] = await Promise.all([
          fetch('/api/invoices'),
          fetch('/api/clients'),
          fetch('/api/projects'),
        ]);

        if (!invoicesResponse.ok) {
          throw new Error(`HTTP error! status: ${invoicesResponse.status}`);
        }
        if (!clientsResponse.ok) {
          throw new Error(`HTTP error! status: ${clientsResponse.status}`);
        }
        if (!projectsResponse.ok) {
          throw new Error(`HTTP error! status: ${projectsResponse.status}`);
        }

        const invoicesData: Invoice[] = await invoicesResponse.json();
        const clientsData: Client[] = await clientsResponse.json();
        const projectsData: Project[] = await projectsResponse.json();

        setInvoices(invoicesData);
        setClients(clientsData);
        setProjects(projectsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewInvoice({ ...newInvoice, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInvoice),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const addedInvoice: Invoice = await response.json();
      setInvoices([...invoices, addedInvoice]);
      setNewInvoice({
        invoiceNumber: '',
        issueDate: '',
        dueDate: '',
        amount: '',
        status: 'Draft',
        projectId: '',
        clientId: '',
        items: '',
      });
      setShowAddForm(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading invoices...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Invoices</h1>
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {showAddForm ? 'Cancel' : 'Create New Invoice'}
      </button>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Create New Invoice</h2>
          <div className="mb-4">
            <label htmlFor="invoiceNumber" className="block text-gray-700 text-sm font-bold mb-2">Invoice Number:</label>
            <input
              type="text"
              id="invoiceNumber"
              name="invoiceNumber"
              value={newInvoice.invoiceNumber}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="clientId" className="block text-gray-700 text-sm font-bold mb-2">Client:</label>
            <select
              id="clientId"
              name="clientId"
              value={newInvoice.clientId}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="projectId" className="block text-gray-700 text-sm font-bold mb-2">Project (Optional):</label>
            <select
              id="projectId"
              name="projectId"
              value={newInvoice.projectId}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="issueDate" className="block text-gray-700 text-sm font-bold mb-2">Issue Date:</label>
            <input
              type="date"
              id="issueDate"
              name="issueDate"
              value={newInvoice.issueDate}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dueDate" className="block text-gray-700 text-sm font-bold mb-2">Due Date:</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={newInvoice.dueDate}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">Amount:</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={newInvoice.amount}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="items" className="block text-gray-700 text-sm font-bold mb-2">Items (JSON format):</label>
            <textarea
              id="items"
              name="items"
              value={newInvoice.items}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
            <select
              id="status"
              name="status"
              value={newInvoice.status}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Invoice
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Invoice #{invoice.invoiceNumber}</h2>
            <p className="text-gray-600">Client: {invoice.client?.name}</p>
            {invoice.project && <p className="text-gray-600">Project: {invoice.project.name}</p>}
            <p className="text-gray-600">Amount: ${invoice.amount.toFixed(2)}</p>
            <p className="text-gray-600">Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}</p>
            <p className="text-gray-600">Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
            <p className="text-gray-600">Status: {invoice.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoicesPage;
