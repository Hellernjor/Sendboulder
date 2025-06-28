
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, Mountain, Edit, Trash2, Users } from 'lucide-react';
import { Location } from '@/types/location';

interface LocationCardProps {
  location: Location;
  onEdit?: (location: Location) => void;
  onDelete?: (locationId: string) => void;
}

const LocationCard = ({ location, onEdit, onDelete }: LocationCardProps) => {
  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'monthly': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'rarely': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'never': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-600/50 rounded-lg">
              {location.type === 'gym' ? (
                <Building className="h-5 w-5 text-blue-400" />
              ) : (
                <Mountain className="h-5 w-5 text-green-400" />
              )}
            </div>
            <div>
              <h3 className="text-white font-medium">{location.name}</h3>
              <p className="text-slate-400 text-sm">{location.address}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs capitalize">
                  {location.type}
                </Badge>
                <Badge className={`text-xs ${getFrequencyColor(location.routeChangeFrequency)}`}>
                  Routes change {location.routeChangeFrequency}
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  Added by {location.createdByUsername}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            {location.createdBy === 'current-user' && (
              <>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-slate-400 hover:text-white"
                  onClick={() => onEdit?.(location)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-slate-400 hover:text-red-400"
                  onClick={() => onDelete?.(location.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
