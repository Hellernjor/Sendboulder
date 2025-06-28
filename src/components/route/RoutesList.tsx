
import React from 'react';
import RouteCard from './RouteCard';
import { Route, Attempt } from '@/types/route';

interface RoutesListProps {
  routes: Route[];
  attempts: Attempt[];
  locationName: string;
}

const RoutesList = ({ routes, attempts, locationName }: RoutesListProps) => {
  if (routes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400 text-sm">No personal routes tracked at this location yet.</p>
        <p className="text-slate-500 text-xs mt-1">Add your first route to start tracking your progress!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-white font-medium">Your Routes at {locationName}</h3>
      {routes.map((route) => (
        <RouteCard
          key={route.id}
          route={route}
          attempts={attempts}
        />
      ))}
    </div>
  );
};

export default RoutesList;
