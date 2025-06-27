'use client';

import React, { useEffect, useState } from 'react';
import { TimeEntry, Project } from '../../app/generated/prisma';

const TimeTrackerPage: React.FC = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newTimeEntry, setNewTimeEntry] = useState({
    startTime: '',
    endTime: '',
    duration: '',
    notes: '',
    projectId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [timeEntriesResponse, projectsResponse] = await Promise.all([
          fetch('/api/time-entries'),
          fetch('/api/projects'),
        ]);

        if (!timeEntriesResponse.ok) {
          throw new Error(`HTTP error! status: ${timeEntriesResponse.status}`);
        }
        if (!projectsResponse.ok) {
          throw new Error(`HTTP error! status: ${projectsResponse.status}`);
        }

        const timeEntriesData: TimeEntry[] = await timeEntriesResponse.json();
        const projectsData: Project[] = await projectsResponse.json();

        setTimeEntries(timeEntriesData);
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
    setNewTimeEntry({ ...newTimeEntry, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTimeEntry),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const addedTimeEntry: TimeEntry = await response.json();
      setTimeEntries([...timeEntries, addedTimeEntry]);
      setNewTimeEntry({
        startTime: '',
        endTime: '',
        duration: '',
        notes: '',
        projectId: '',
      });
      setShowAddForm(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading time entries...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Time Tracker</h1>
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {showAddForm ? 'Cancel' : 'Add New Time Entry'}
      </button>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Add New Time Entry</h2>
          <div className="mb-4">
            <label htmlFor="projectId" className="block text-gray-700 text-sm font-bold mb-2">Project:</label>
            <select
              id="projectId"
              name="projectId"
              value={newTimeEntry.projectId}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
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
            <label htmlFor="startTime" className="block text-gray-700 text-sm font-bold mb-2">Start Time:</label>
            <input
              type="datetime-local"
              id="startTime"
              name="startTime"
              value={newTimeEntry.startTime}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="endTime" className="block text-gray-700 text-sm font-bold mb-2">End Time (Optional):</label>
            <input
              type="datetime-local"
              id="endTime"
              name="endTime"
              value={newTimeEntry.endTime}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="duration" className="block text-gray-700 text-sm font-bold mb-2">Duration (hours, Optional):</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={newTimeEntry.duration}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              step="0.01"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">Notes:</label>
            <textarea
              id="notes"
              name="notes"
              value={newTimeEntry.notes}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Time Entry
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {timeEntries.map((entry) => (
          <div key={entry.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Project: {entry.project?.name}</h2>
            <p className="text-gray-600">Start: {new Date(entry.startTime).toLocaleString()}</p>
            {entry.endTime && <p className="text-gray-600">End: {new Date(entry.endTime).toLocaleString()}</p>}
            {entry.duration && <p className="text-gray-600">Duration: {entry.duration.toFixed(2)} hours</p>}
            {entry.notes && <p className="text-gray-600">Notes: {entry.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeTrackerPage;
