
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
      case 'weekly': return 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30';
      case 'monthly': return 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'rarely': return 'bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30';
      case 'never': return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      default: return 'bg-slate-500/20 text-slate-600 dark:text-slate-400 border-slate-500/30';
    }
  };

  return (
    <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-200 dark:border-cyan-600 hover:shadow-lg transition-all hover:from-cyan-100 hover:to-blue-100 dark:hover:from-cyan-900/30 dark:hover:to-blue-900/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              {location.type === 'gym' ? (
                <Building className="h-5 w-5 text-white" />
              ) : (
                <Mountain className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-cyan-800 dark:text-cyan-200 font-medium">{location.name}</h3>
              <p className="text-cyan-600 dark:text-cyan-300 text-sm">{location.address}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs capitalize border-indigo-300 text-indigo-600 dark:text-indigo-400">
                  {location.type}
                </Badge>
                <Badge className={`text-xs ${getFrequencyColor(location.routeChangeFrequency)}`}>
                  Routes change {location.routeChangeFrequency}
                </Badge>
                <Badge className="bg-violet-500/20 text-violet-600 dark:text-violet-400 border-violet-500/30 text-xs">
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
                  className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                  onClick={() => onEdit?.(location)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-rose-500 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-900/30"
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
