const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database');

// ============================================
// GET /api/tasks - Get all tasks
// Supports: ?status=active&search=keyword
// ============================================
router.get('/', (req, res) => {
  try {
    const { status, search } = req.query;
    const tasks = db.getTasks({ status, search });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// ============================================
// POST /api/tasks - Create a new task
// Body: { title, description?, dueDate? }
// ============================================
router.post('/', (req, res) => {
  try {
    const { title, description = '', dueDate = null } = req.body;

    // Validate required field
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Create new task object
    const now = new Date().toISOString();
    const task = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate,
      completed: 0,
      created_at: now,
      updated_at: now
    };

    // Save to database
    db.addTask(task);
    
    console.log(`✅ Task created: ${task.title}`);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// ============================================
// PUT /api/tasks/:id - Update a task
// Body can include: title, description, dueDate, completed
// ============================================
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, completed } = req.body;

    // Check if task exists
    const existingTask = db.findTaskById(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Build updates object
    const updates = {
      updated_at: new Date().toISOString()
    };

    // Only update fields that were provided
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (dueDate !== undefined) updates.due_date = dueDate;
    if (completed !== undefined) updates.completed = completed ? 1 : 0;

    // Update task
    const updatedTask = db.updateTask(id, updates);
    
    console.log(`✅ Task updated: ${updatedTask.title}`);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// ============================================
// DELETE /api/tasks/:id - Delete a task
// ============================================
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if task exists
    const task = db.findTaskById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Delete the task
    db.deleteTask(id);
    
    console.log(`🗑️ Task deleted: ${task.title}`);
    res.json({ 
      message: 'Task deleted successfully',
      deletedTask: task 
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// ============================================
// PATCH /api/tasks/:id/toggle - Toggle completion
// ============================================
router.patch('/:id/toggle', (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if task exists
    const task = db.findTaskById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Toggle the completed status
    const updates = {
      completed: task.completed ? 0 : 1,
      updated_at: new Date().toISOString()
    };

    const updatedTask = db.updateTask(id, updates);
    
    const status = updatedTask.completed ? 'completed' : 'active';
    console.log(`🔄 Task toggled to ${status}: ${updatedTask.title}`);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error toggling task:', error);
    res.status(500).json({ error: 'Failed to toggle task' });
  }
});

module.exports = router;