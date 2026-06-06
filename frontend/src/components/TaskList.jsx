import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onToggle, onDelete, onUpdate }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="text-6xl mb-6 animate-float">📝</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-2">No tasks found</h3>
        <p className="text-gray-500 mb-8 text-lg">
          Add your first task above to get started!
        </p>
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 inline-block text-left border border-gray-100">
          <p className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>💡</span> Try adding tasks like:
          </p>
          <ul className="space-y-2">
            {[
              { icon: '📅', text: 'Schedule a meeting' },
              { icon: '🛒', text: 'Buy groceries' },
              { icon: '📚', text: 'Read a book' },
              { icon: '💻', text: 'Complete the project' },
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
                <span className="text-lg">{item.icon}</span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
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