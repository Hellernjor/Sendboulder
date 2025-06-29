
import React from 'react';

const EmptyRoutesMessage = () => {
  return (
    <div className="text-center py-8">
      <p className="text-purple-400 text-sm">No personal routes tracked at this location yet.</p>
      <p className="text-indigo-400 text-xs mt-1">Add your first route to start tracking your progress!</p>
    </div>
  );
};

export default EmptyRoutesMessage;
