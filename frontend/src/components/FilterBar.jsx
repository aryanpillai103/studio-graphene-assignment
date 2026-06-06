import React from 'react';

function FilterBar({ filter, onFilterChange, searchQuery, onSearchChange }) {
  const filters = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pb-4 border-b-2 border-gray-100 dark:border-gray-700 transition-colors duration-300">
      {/* Filter Buttons */}
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl gap-1 self-start">
        {filters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition-all duration-200
              ${filter === value 
                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'}`}
          >
            {label}
          </button>
        ))}
      </div>
      
      {/* Search Input */}
      <div className="relative w-full sm:w-64">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40 select-none">
          🔍
        </span>
        <input
          data-search-input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-10 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl 
            bg-gray-50 dark:bg-gray-700
            text-gray-800 dark:text-gray-200
            focus:bg-white dark:focus:bg-gray-600
            focus:border-primary-500 
            focus:ring-4 focus:ring-primary-500/10 dark:focus:ring-primary-500/20
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            transition-all duration-200 text-sm outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 
              bg-gray-200 dark:bg-gray-600
              hover:bg-red-100 dark:hover:bg-red-900/50
              hover:text-red-500 dark:hover:text-red-400
              rounded-full flex items-center justify-center 
              text-gray-500 dark:text-gray-400
              transition-all duration-200 text-sm"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export default FilterBar;