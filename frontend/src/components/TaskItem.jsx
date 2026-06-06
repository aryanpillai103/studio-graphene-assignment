import React, { useState } from 'react';
import { format, isPast, parseISO } from 'date-fns';
import './TaskItem.css';

function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [editedDueDate, setEditedDueDate] = useState(task.due_date || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Check if task is overdue
  const isOverdue = task.due_date && !task.completed && isPast(parseISO(task.due_date));

  // Format the due date for display
  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM d, yyyy');
    } catch {
      return null;
    }
  };

  // Format created date
  const formatCreatedDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch {
      return 'Unknown';
    }
  };

  // Handle save edit
  const handleSave = () => {
    if (!editedTitle.trim()) return;

    onUpdate(task.id, {
      title: editedTitle.trim(),
      description: editedDescription.trim(),
      dueDate: editedDueDate || null,
    });
    setIsEditing(false);
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description || '');
    setEditedDueDate(task.due_date || '');
    setIsEditing(false);
  };

  // Handle delete
  const handleDelete = () => {
    onDelete(task.id);
    setShowDeleteConfirm(false);
  };

  // Keyboard shortcuts for edit mode
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Edit mode
  if (isEditing) {
    return (
      <div className="task-item editing">
        <div className="edit-form">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="edit-title"
            placeholder="Task title"
            autoFocus
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            className="edit-description"
            placeholder="Description (optional)"
            rows="2"
          />
          <div className="edit-date">
            <label>📅 Due date:</label>
            <input
              type="date"
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
            />
          </div>
          <div className="edit-actions">
            <button onClick={handleSave} className="save-btn">Save</button>
            <button onClick={handleCancel} className="cancel-btn">Cancel</button>
          </div>
          <div className="edit-hint">
            Press Ctrl+Enter to save, Esc to cancel
          </div>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-content">
        <div className="task-left">
          <input
            type="checkbox"
            checked={Boolean(task.completed)}
            onChange={() => onToggle(task.id)}
            className="task-checkbox"
          />
          <div className="task-info">
            <h3 className="task-title">{task.title}</h3>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            <div className="task-meta">
              {task.due_date && (
                <span className={`due-date ${isOverdue ? 'overdue-text' : ''}`}>
                  📅 {formatDueDate(task.due_date)}
                  {isOverdue && ' ⚠️ Overdue'}
                </span>
              )}
              <span className="created-date">
                Created: {formatCreatedDate(task.created_at)}
              </span>
            </div>
          </div>
        </div>
        <div className="task-actions">
          <button
            onClick={() => setIsEditing(true)}
            className="action-btn edit-btn"
            title="Edit task"
          >
            ✏️
          </button>
          {showDeleteConfirm ? (
            <div className="delete-confirm">
              <span className="confirm-text">Delete?</span>
              <button onClick={handleDelete} className="confirm-delete-btn">
                Yes
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="cancel-delete-btn"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="action-btn delete-btn"
              title="Delete task"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskItem;