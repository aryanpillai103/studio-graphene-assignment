import React, { useState } from 'react';
import './TaskForm.css';

function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate title
    if (!title.trim()) return;

    // Submit the task
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setDueDate('');
    setIsExpanded(false);
  };

  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-main">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="title-input"
          required
          autoFocus
        />
        <button
          type="button"
          className="expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? 'Hide details' : 'Add details'}
        >
          {isExpanded ? '−' : '+'}
        </button>
        <button type="submit" className="submit-btn">
          Add Task
        </button>
      </div>

      {isExpanded && (
        <div className="form-details">
          <textarea
            placeholder="Add a description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="description-input"
            rows="3"
          />
          <div className="date-input-container">
            <label htmlFor="dueDate">
              <span className="label-icon">📅</span>
              Due date:
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="date-input"
            />
            {dueDate && (
              <button
                type="button"
                className="clear-date"
                onClick={() => setDueDate('')}
                title="Clear date"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}
    </form>
  );
}

export default TaskForm;