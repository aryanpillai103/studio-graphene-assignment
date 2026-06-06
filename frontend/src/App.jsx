import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import TaskStats from './components/TaskStats';
import './App.css';

const API_URL = '/api/tasks';

function App() {
  // State management
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = {};
      if (filter !== 'all') params.status = filter;
      if (searchQuery) params.search = searchQuery;
      
      const response = await axios.get(API_URL, { params });
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [filter, searchQuery]);

  // Fetch tasks when filter or search changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Add a new task
  const addTask = async (taskData) => {
    try {
      await axios.post(API_URL, taskData);
      await fetchTasks(); // Refresh the list
    } catch (err) {
      setError('Failed to add task. Please try again.');
      console.error('Error adding task:', err);
    }
  };

  // Update a task
  const updateTask = async (id, updates) => {
    try {
      await axios.put(`${API_URL}/${id}`, updates);
      await fetchTasks();
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchTasks();
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    }
  };

  // Toggle task completion
  const toggleTask = async (id) => {
    try {
      await axios.patch(`${API_URL}/${id}/toggle`);
      await fetchTasks();
    } catch (err) {
      setError('Failed to toggle task. Please try again.');
      console.error('Error toggling task:', err);
    }
  };

  // Calculate task statistics
  const activeCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Task Manager</h1>
        <p className="subtitle">Stay organized and productive</p>
      </header>

      <main className="app-main">
        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="error-close">×</button>
          </div>
        )}

        {/* Task Statistics */}
        <TaskStats activeCount={activeCount} completedCount={completedCount} />
        
        {/* Add Task Form */}
        <TaskForm onSubmit={addTask} />
        
        {/* Filter and Search Bar */}
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Task List or Loading/Empty State */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading tasks...</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        )}
      </main>
    </div>
  );
}

export default App;