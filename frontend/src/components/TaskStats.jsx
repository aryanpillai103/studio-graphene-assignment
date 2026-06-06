import React from 'react';
import './TaskStats.css';

function TaskStats({ activeCount, completedCount }) {
  const totalCount = activeCount + completedCount;

  // Don't show stats if there are no tasks
  if (totalCount === 0) return null;

  return (
    <div className="task-stats">
      <div className="stat total">
        <span className="stat-number">{totalCount}</span>
        <span className="stat-label">Total Tasks</span>
      </div>
      <div className="stat active">
        <span className="stat-number">{activeCount}</span>
        <span className="stat-label">Active</span>
      </div>
      <div className="stat completed">
        <span className="stat-number">{completedCount}</span>
        <span className="stat-label">Completed</span>
      </div>
      {totalCount > 0 && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}

export default TaskStats;