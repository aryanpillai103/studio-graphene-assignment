import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useDarkMode from './hooks/useDarkMode';
import DarkModeToggle from './components/DarkModeToggle';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import TaskStats from './components/TaskStats';

const API_URL = import.meta.env.VITE_API_URL || '/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDark, toggleDarkMode] = useDarkMode();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
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

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Toggle dark mode: Ctrl+Shift+D
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggleDarkMode();
      }
      // Focus search: Ctrl+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('[data-search-input]')?.focus();
      }
      // New task: Ctrl+N
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        document.querySelector('[data-title-input]')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleDarkMode]);

  const addTask = async (taskData) => {
    try {
      await axios.post(API_URL, taskData);
      await fetchTasks();
    } catch (err) {
      setError('Failed to add task. Please try again.');
      console.error('Error adding task:', err);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      await axios.put(`${API_URL}/${id}`, updates);
      await fetchTasks();
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchTasks();
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    }
  };

  const toggleTask = async (id) => {
    try {
      await axios.patch(`${API_URL}/${id}/toggle`);
      await fetchTasks();
    } catch (err) {
      setError('Failed to toggle task. Please try again.');
      console.error('Error toggling task:', err);
    }
  };

  const activeCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      
      {/* Dark Mode Toggle */}
      <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />

      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
        
        {/* Header */}
        <header className="text-center mb-8">
          <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 
            dark:from-primary-700 dark:via-primary-800 dark:to-purple-800
            text-white rounded-2xl p-8 sm:p-12 shadow-xl shadow-primary-500/20 
            dark:shadow-primary-900/30 transition-colors duration-300">
            <h1 className="text-4xl sm:text-5xl font-bold mb-3 flex items-center justify-center gap-3">
              <span className="text-4xl">📝</span>
              Task Manager
            </h1>
            <p className="text-primary-100 dark:text-primary-200 text-lg font-light">
              Stay organized and productive
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-primary-200 dark:text-primary-300 text-sm">
              <span className="flex items-center gap-1.5 bg-white/10 dark:bg-white/5 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs font-mono">Ctrl+N</kbd>
                <span>New Task</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 dark:bg-white/5 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs font-mono">Ctrl+K</kbd>
                <span>Search</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 dark:bg-white/5 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs font-mono">Ctrl+Shift+D</kbd>
                <span>{isDark ? 'Light' : 'Dark'} Mode</span>
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-6">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 
              border border-red-200 dark:border-red-800 
              text-red-700 dark:text-red-400 
              px-6 py-4 rounded-xl flex justify-between items-center 
              animate-slide-down shadow-sm transition-colors duration-300">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <span className="text-sm sm:text-base">{error}</span>
              </div>
              <button 
                onClick={() => setError(null)} 
                className="text-red-400 hover:text-red-600 dark:hover:text-red-300 text-2xl leading-none ml-4 transition-colors"
              >
                ×
              </button>
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

          {/* Loading or Task List */}
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block w-12 h-12 border-4 border-primary-200 dark:border-primary-800 
                border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Loading tasks...</p>
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

        {/* Footer */}
        <footer className="text-center mt-12 pb-6 text-gray-400 dark:text-gray-600 text-sm transition-colors duration-300">
          <p>Built with ❤️ using React, Node.js & Tailwind CSS</p>
          <p className="mt-1 text-xs">
            Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">Ctrl+Shift+D</kbd> to toggle dark mode
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;