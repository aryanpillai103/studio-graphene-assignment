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
    
    // Start building the SQL query
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    // Add status filter if provided
    if (status === 'active') {
      query += ' AND completed = 0';
    } else if (status === 'completed') {
      query += ' AND completed = 1';
    }

    // Add search filter if provided
    if (search) {
      query += ' AND title LIKE ?';
      params.push(`%${search}%`);
    }

    // Always order by newest first
    query += ' ORDER BY created_at DESC';
    
    // Execute the query
    const tasks = db.prepare(query).all(...params);
    
    // Return tasks as JSON
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

    // Generate unique ID and timestamp
    const id = uuidv4();
    const now = new Date().toISOString();

    // Insert the new task
    const stmt = db.prepare(`
      INSERT INTO tasks (id, title, description, due_date, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, title.trim(), description.trim(), dueDate, now, now);

    // Fetch and return the created task
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    
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
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Build dynamic update query
    const now = new Date().toISOString();
    const updates = [];
    const params = [];

    // Only update fields that were provided
    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title.trim());
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description.trim());
    }
    if (dueDate !== undefined) {
      updates.push('due_date = ?');
      params.push(dueDate);
    }
    if (completed !== undefined) {
      updates.push('completed = ?');
      params.push(completed ? 1 : 0);
    }

    // Always update the timestamp
    updates.push('updated_at = ?');
    params.push(now);
    params.push(id); // For WHERE clause

    // Execute update
    const stmt = db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...params);

    // Return updated task
    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    
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
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Delete the task
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    
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
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Toggle the completed status
    const now = new Date().toISOString();
    const newCompleted = task.completed ? 0 : 1;
    
    db.prepare('UPDATE tasks SET completed = ?, updated_at = ? WHERE id = ?')
      .run(newCompleted, now, id);

    // Return updated task
    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    
    const status = updatedTask.completed ? 'completed' : 'active';
    console.log(`🔄 Task toggled to ${status}: ${updatedTask.title}`);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error toggling task:', error);
    res.status(500).json({ error: 'Failed to toggle task' });
  }
});

module.exports = router;