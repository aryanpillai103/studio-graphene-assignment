import React, { useState } from 'react';
import { format, isPast, parseISO } from 'date-fns';

function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [editedDueDate, setEditedDueDate] = useState(task.due_date || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOverdue = task.due_date && !task.completed && isPast(parseISO(task.due_date));

  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch {
      return null;
    }
  };

  const formatCreatedDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch {
      return 'Unknown';
    }
  };

  const handleSave = () => {
    if (!editedTitle.trim()) return;
    onUpdate(task.id, {
      title: editedTitle.trim(),
      description: editedDescription.trim(),
      dueDate: editedDueDate || null,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description || '');
    setEditedDueDate(task.due_date || '');
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(task.id);
    setShowDeleteConfirm(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) handleSave();
    else if (e.key === 'Escape') handleCancel();
  };

  // Edit Mode
  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-primary-400 dark:border-primary-500 
        shadow-lg shadow-primary-500/10 dark:shadow-primary-500/20 p-4 sm:p-5 animate-fade-in transition-colors duration-300">
        <div className="space-y-3">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-lg 
              bg-white dark:bg-gray-700
              text-gray-800 dark:text-gray-200
              focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:focus:ring-primary-500/20
              transition-all font-medium outline-none"
            placeholder="Task title"
            autoFocus
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-lg 
              bg-white dark:bg-gray-700
              text-gray-800 dark:text-gray-200
              focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:focus:ring-primary-500/20
              transition-all resize-none text-sm outline-none"
            placeholder="Description (optional)"
            rows="2"
          />
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">📅 Due date:</label>
            <input
              type="date"
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
              className="px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-700
                text-gray-800 dark:text-gray-200
                focus:border-primary-500 transition-all text-sm outline-none
                [color-scheme:light] dark:[color-scheme:dark]"
            />
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-gray-400 dark:text-gray-500 italic hidden sm:block">
              Ctrl+Enter to save • Esc to cancel
            </span>
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button onClick={handleSave} className="btn-primary text-sm px-4 py-2">
                Save
              </button>
              <button onClick={handleCancel} className="btn-secondary text-sm px-4 py-2">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Display Mode
  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-xl border-2 transition-all duration-300 p-4 sm:p-5
      animate-fade-in group
      ${task.completed 
        ? 'opacity-75 bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700' 
        : isOverdue 
          ? 'border-l-4 border-l-red-500 bg-red-50/30 dark:bg-red-900/10 dark:border-l-red-400' 
          : 'border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md dark:hover:shadow-gray-900/50'}`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={Boolean(task.completed)}
          onChange={() => onToggle(task.id)}
          className="mt-1 w-5 h-5 rounded border-gray-300 dark:border-gray-600 
            text-primary-600 dark:text-primary-500
            focus:ring-primary-500 dark:focus:ring-primary-400 
            cursor-pointer accent-primary-600 dark:accent-primary-500 flex-shrink-0"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-base sm:text-lg font-semibold mb-1 break-words
            ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 break-words">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {task.due_date && (
              <span className={`inline-flex items-center gap-1 font-medium
                ${isOverdue ? 'text-red-500 dark:text-red-400 animate-pulse-soft' : 'text-gray-500 dark:text-gray-400'}`}>
                <span>📅</span>
                {formatDueDate(task.due_date)}
                {isOverdue && (
                  <span className="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full text-xs font-bold">
                    Overdue
                  </span>
                )}
              </span>
            )}
            <span className="text-gray-400 dark:text-gray-500">
              Created: {formatCreatedDate(task.created_at)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-lg"
            title="Edit task"
          >
            ✏️
          </button>
          
          {showDeleteConfirm ? (
            <div className="flex items-center gap-1 bg-red-50 dark:bg-red-900/30 p-1.5 rounded-lg animate-slide-in">
              <span className="text-xs text-red-600 dark:text-red-400 font-medium whitespace-nowrap">Delete?</span>
              <button
                onClick={handleDelete}
                className="px-2.5 py-1 bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500 text-white text-xs font-medium rounded transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-2.5 py-1 bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-500 text-white text-xs font-medium rounded transition-colors"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors text-lg"
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