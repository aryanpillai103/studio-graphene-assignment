const fs = require('fs');
const path = require('path');

// Use environment variable for production, local path for development
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'tasks.json');

// Initialize database file if it doesn't exist
function initializeDatabase() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
    console.log('✅ Created new tasks.json database file');
  }
}

// Read all tasks from JSON file
function readTasks() {
  try {
    initializeDatabase();
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return [];
  }
}

// Write tasks to JSON file
function writeTasks(tasks) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(tasks, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to database:', error);
    return false;
  }
}

// Find a task by ID
function findTaskById(id) {
  const tasks = readTasks();
  return tasks.find(task => task.id === id);
}

// Add a new task
function addTask(task) {
  const tasks = readTasks();
  tasks.push(task);
  writeTasks(tasks);
  return task;
}

// Update a task
function updateTask(id, updates) {
  const tasks = readTasks();
  const index = tasks.findIndex(task => task.id === id);
  
  if (index === -1) return null;
  
  // Update only provided fields
  tasks[index] = { ...tasks[index], ...updates };
  writeTasks(tasks);
  return tasks[index];
}

// Delete a task
function deleteTask(id) {
  const tasks = readTasks();
  const index = tasks.findIndex(task => task.id === id);
  
  if (index === -1) return null;
  
  const deletedTask = tasks[index];
  tasks.splice(index, 1);
  writeTasks(tasks);
  return deletedTask;
}

// Get all tasks with optional filters
function getTasks({ status, search } = {}) {
  let tasks = readTasks();
  
  // Filter by status
  if (status === 'active') {
    tasks = tasks.filter(task => !task.completed);
  } else if (status === 'completed') {
    tasks = tasks.filter(task => task.completed);
  }
  
  // Search by title (case-insensitive)
  if (search) {
    const searchLower = search.toLowerCase();
    tasks = tasks.filter(task => 
      task.title.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort by created_at descending (newest first)
  tasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  return tasks;
}

// Initialize on module load
initializeDatabase();

module.exports = {
  readTasks,
  writeTasks,
  findTaskById,
  addTask,
  updateTask,
  deleteTask,
  getTasks
};