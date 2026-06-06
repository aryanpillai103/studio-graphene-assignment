import React, { useState, useRef, useEffect } from 'react';

function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const titleInputRef = useRef(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null,
    });

    setTitle('');
    setDescription('');
    setDueDate('');
    setIsExpanded(false);
    
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      setIsExpanded(true);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const daysUntilDue = dueDate 
    ? Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24)) 
    : null;

  return (
    <form 
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl border-2 transition-all duration-300 
        ${isExpanded ? 'border-primary-400 shadow-lg shadow-primary-500/10' : 'border-gray-100 shadow-sm hover:shadow-md'}`}
    >
      <div className="p-4 sm:p-6">
        {/* Main Input Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-40 select-none">
              📝
            </span>
            <input
              ref={titleInputRef}
              data-title-input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full pl-11 pr-12 py-3.5 border-2 rounded-xl text-base
                bg-gray-50 focus:bg-white focus:border-primary-500 
                focus:ring-4 focus:ring-primary-500/10
                placeholder:text-gray-400 transition-all duration-200
                hover:bg-gray-100 focus:hover:bg-white outline-none
                ${isShaking ? 'animate-shake border-red-400' : 'border-gray-200'}`}
            />
            {title && (
              <button
                type="button"
                onClick={() => setTitle('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 
                  bg-gray-200 hover:bg-red-100 hover:text-red-500 
                  rounded-full flex items-center justify-center 
                  text-gray-500 transition-all duration-200"
              >
                ×
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center gap-1.5 px-4 py-3 rounded-xl font-medium 
                transition-all duration-200 text-sm
                ${isExpanded 
                  ? 'bg-primary-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-gray-200'}`}
            >
              <span className={`text-lg transition-transform duration-300 ${isExpanded ? 'rotate-45' : ''}`}>
                +
              </span>
              <span className="hidden sm:inline">{isExpanded ? 'Less' : 'More'}</span>
            </button>
            
            <button
              type="submit"
              disabled={!title.trim()}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold 
                transition-all duration-200 text-sm
                ${title.trim() 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:shadow-primary-500/25 active:scale-95' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              <span>➕</span>
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t-2 border-gray-100 animate-slide-down">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Description Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  <span>📋</span> Description
                </label>
                <div className="relative">
                  <textarea
                    placeholder="Add details about this task..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
                      bg-gray-50 focus:bg-white focus:border-primary-500 
                      focus:ring-4 focus:ring-primary-500/10
                      placeholder:text-gray-400 transition-all duration-200
                      resize-none text-sm outline-none"
                    rows="3"
                    maxLength="500"
                  />
                  <span className="absolute bottom-2 right-3 text-xs text-gray-400 bg-gray-50/90 px-2 py-0.5 rounded-full">
                    {description.length}/500
                  </span>
                </div>
              </div>

              {/* Due Date Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  <span>📅</span> Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={today}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl 
                      bg-gray-50 focus:bg-white focus:border-primary-500 
                      focus:ring-4 focus:ring-primary-500/10
                      cursor-pointer transition-all duration-200 text-sm outline-none"
                  />
                  {dueDate && (
                    <button
                      type="button"
                      onClick={() => setDueDate('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 
                        bg-gray-200 hover:bg-red-100 hover:text-red-500 
                        rounded-full flex items-center justify-center 
                        text-gray-500 transition-all duration-200"
                    >
                      ×
                    </button>
                  )}
                </div>
                {daysUntilDue !== null && (
                  <p className={`text-xs font-medium ${
                    daysUntilDue < 0 ? 'text-red-500' : 
                    daysUntilDue === 0 ? 'text-orange-500' : 
                    daysUntilDue <= 2 ? 'text-yellow-600' : 'text-primary-600'
                  }`}>
                    {daysUntilDue < 0 
                      ? `⚠️ Overdue by ${Math.abs(daysUntilDue)} days` 
                      : daysUntilDue === 0 
                        ? '⏰ Due today!' 
                        : `📅 Due in ${daysUntilDue} days`}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 
                  font-medium rounded-xl border-2 border-gray-200 
                  transition-all duration-200 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

export default TaskForm;