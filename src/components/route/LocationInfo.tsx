
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Location } from '@/types/location';

interface LocationInfoProps {
  location: Location;
}

const LocationInfo = ({ location }: LocationInfoProps) => {
  return (
    <Card className="bg-slate-700/30 border-slate-600">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium">{location.name}</h3>
            <p className="text-slate-400 text-sm">{location.address}</p>
            <p className="text-slate-500 text-xs mt-1">
              Added by {location.createdByUsername} • Community location
            </p>
          </div>
          <div className="flex flex-col space-y-1">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
              Routes change {location.routeChangeFrequency}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationInfo;
