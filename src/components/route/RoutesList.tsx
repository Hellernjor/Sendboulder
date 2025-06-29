
import React from 'react';
import { Route, Attempt } from '@/types/route';
import { Location } from '@/types/location';
import RouteCard from './RouteCard';
import EmptyRoutesMessage from './EmptyRoutesMessage';

interface RoutesListProps {
  routes: Route[];
  attempts: Attempt[];
  locationName: string;
  location: Location;
  onLogAttempt?: (routeId: string, attempts: number, completed: boolean, notes?: string) => Promise<void>;
}

const RoutesList = ({ routes, attempts, locationName, location, onLogAttempt }: RoutesListProps) => {
  if (routes.length === 0) {
    return <EmptyRoutesMessage />;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-white font-medium">Your Routes at {locationName}</h3>
      <div className="space-y-2">
        {routes.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            attempts={attempts}
            location={location}
            onLogAttempt={onLogAttempt}
          />
        ))}
      </div>
    </div>
  );
};

export default RoutesList;
