'use client';

import React, { useEffect, useState } from 'react';
import { Project, Client } from '../../app/generated/prisma';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newProject, setNewProject] = useState({
    name: '',
    deadline: '',
    value: '',
    milestones: '',
    brief: '',
    attachments: '',
    status: 'To Do',
    clientId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, clientsResponse] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/clients'),
        ]);

        if (!projectsResponse.ok) {
          throw new Error(`HTTP error! status: ${projectsResponse.status}`);
        }
        if (!clientsResponse.ok) {
          throw new Error(`HTTP error! status: ${clientsResponse.status}`);
        }

        const projectsData: Project[] = await projectsResponse.json();
        const clientsData: Client[] = await clientsResponse.json();

        setProjects(projectsData);
        setClients(clientsData);
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
    setNewProject({ ...newProject, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const addedProject: Project = await response.json();
      setProjects([...projects, addedProject]);
      setNewProject({
        name: '',
        deadline: '',
        value: '',
        milestones: '',
        brief: '',
        attachments: '',
        status: 'To Do',
        clientId: '',
      });
      setShowAddForm(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {showAddForm ? 'Cancel' : 'Add New Project'}
      </button>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Add New Project</h2>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Project Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newProject.name}
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
              value={newProject.clientId}
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
            <label htmlFor="deadline" className="block text-gray-700 text-sm font-bold mb-2">Deadline:</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={newProject.deadline}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="value" className="block text-gray-700 text-sm font-bold mb-2">Project Value:</label>
            <input
              type="number"
              id="value"
              name="value"
              value={newProject.value}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="milestones" className="block text-gray-700 text-sm font-bold mb-2">Milestones:</label>
            <textarea
              id="milestones"
              name="milestones"
              value={newProject.milestones}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="brief" className="block text-gray-700 text-sm font-bold mb-2">Brief:</label>
            <textarea
              id="brief"
              name="brief"
              value={newProject.brief}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="attachments" className="block text-gray-700 text-sm font-bold mb-2">Attachments (comma-separated paths):</label>
            <input
              type="text"
              id="attachments"
              name="attachments"
              value={newProject.attachments}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
            <select
              id="status"
              name="status"
              value={newProject.status}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Project
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
            <p className="text-gray-600">Client: {project.client?.name}</p>
            {project.deadline && <p className="text-gray-600">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>}
            {project.value && <p className="text-gray-600">Value: ${project.value.toFixed(2)}</p>}
            <p className="text-gray-600">Status: {project.status}</p>
            {project.brief && <p className="text-gray-600">Brief: {project.brief}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
