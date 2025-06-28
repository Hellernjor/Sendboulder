
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Location } from '@/types/location';

interface LocationInfoProps {
  location: Location;
}

const LocationInfo = ({ location }: LocationInfoProps) => {
  return (
    <Card className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-200 dark:border-purple-600">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-purple-800 dark:text-purple-200 font-medium">{location.name}</h3>
            <p className="text-purple-600 dark:text-purple-300 text-sm">{location.address}</p>
            <p className="text-purple-500 dark:text-purple-400 text-xs mt-1">
              Added by {location.createdByUsername} • Community location
            </p>
          </div>
          <div className="flex flex-col space-y-1">
            <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30 text-xs">
              Routes change {location.routeChangeFrequency}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationInfo;
