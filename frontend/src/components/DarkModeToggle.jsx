import React from 'react';

function DarkModeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 p-3 rounded-full 
        bg-white dark:bg-gray-800 
        border-2 border-gray-200 dark:border-gray-700
        shadow-lg hover:shadow-xl
        transition-all duration-300 hover:scale-110
        group"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle dark mode"
    >
      {/* Sun icon (shown in dark mode) */}
      <span className={`text-2xl transition-all duration-300 ${isDark ? 'block' : 'hidden'}`}>
        ☀️
      </span>
      {/* Moon icon (shown in light mode) */}
      <span className={`text-2xl transition-all duration-300 ${isDark ? 'hidden' : 'block'}`}>
        🌙
      </span>
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 
        bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 
        text-xs font-medium px-2 py-1 rounded 
        opacity-0 group-hover:opacity-100 transition-opacity
        whitespace-nowrap pointer-events-none">
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </span>
    </button>
  );
}

export default DarkModeToggle;