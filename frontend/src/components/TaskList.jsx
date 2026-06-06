import React from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

function TaskList({ tasks, onToggle, onDelete, onUpdate }) {
  // Empty state when no tasks
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <h3>No tasks found</h3>
        <p>Add your first task above to get started!</p>
        <div className="empty-state-suggestions">
          <p>Try adding tasks like:</p>
          <ul>
            <li>📅 Schedule a meeting</li>
            <li>🛒 Buy groceries</li>
            <li>📚 Read a book</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

export default TaskList;