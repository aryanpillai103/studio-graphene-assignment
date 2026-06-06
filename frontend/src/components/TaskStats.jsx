import React, { useEffect, useState } from 'react';

function TaskStats({ activeCount, completedCount }) {
  const totalCount = activeCount + completedCount;
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (totalCount > 0 && activeCount === 0) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [activeCount, totalCount]);

  if (totalCount === 0) return null;

  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const stats = [
    { 
      count: totalCount, 
      label: 'Total', 
      gradient: 'from-blue-50 to-blue-100', 
      border: 'border-blue-200',
      textColor: 'text-blue-700',
      labelColor: 'text-blue-600'
    },
    { 
      count: activeCount, 
      label: 'Active', 
      gradient: 'from-orange-50 to-orange-100', 
      border: 'border-orange-200',
      textColor: 'text-orange-700',
      labelColor: 'text-orange-600'
    },
    { 
      count: completedCount, 
      label: 'Done', 
      gradient: 'from-green-50 to-green-100', 
      border: 'border-green-200',
      textColor: 'text-green-700',
      labelColor: 'text-green-600'
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <div 
            key={stat.label}
            className={`bg-gradient-to-br ${stat.gradient} ${stat.border} 
              border rounded-xl p-3 sm:p-4 text-center 
              hover:scale-105 transition-transform duration-200`}
          >
            <span className={`block text-2xl sm:text-3xl font-bold ${stat.textColor}`}>
              {stat.count}
            </span>
            <span className={`text-xs sm:text-sm ${stat.labelColor} font-medium uppercase tracking-wide`}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-700 ease-out shadow-sm"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Celebration */}
      {showCelebration && (
        <div className="bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl p-4 text-center animate-slide-down shadow-lg">
          <span className="text-lg font-semibold">🎉 All tasks completed! Great job! 🎉</span>
        </div>
      )}
    </div>
  );
}

export default TaskStats;