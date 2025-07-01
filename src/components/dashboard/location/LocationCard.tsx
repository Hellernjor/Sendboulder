
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Location } from '@/types/location';
import { Logger } from '@/lib/logger';

interface LocationCardProps {
  location: Location;
  distance?: number | null;
  canEdit: boolean;
  onEdit: (location: Location) => void;
  onDelete: (locationId: string) => void;
}

const LocationCard = ({ location, distance, canEdit, onEdit, onDelete }: LocationCardProps) => {
  Logger.component('LocationCard', `Rendering location card for ${location.name}`);

  return (
    <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg hover:bg-blue-100/50 transition-colors border border-blue-100">
      <div className="flex-1 cursor-pointer">
        <h3 className="text-slate-800 font-medium text-sm">{location.name}</h3>
        <div className="flex items-center space-x-2 mt-1">
          <Badge 
            variant={location.type === 'gym' ? 'default' : 'secondary'}
            className="text-xs bg-blue-100 text-blue-700 border-blue-200"
          >
            {location.type}
          </Badge>
          {distance && (
            <span className="text-slate-500 text-xs">
              {distance < 1 ? 
                `${Math.round(distance * 1000)}m` : 
                `${distance.toFixed(1)}km`
              }
            </span>
          )}
        </div>
      </div>
      
      {canEdit && (
        <div className="flex space-x-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(location)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 h-8 w-8 p-0"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(location.id)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default LocationCard;
