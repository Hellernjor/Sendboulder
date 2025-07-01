
import React from 'react';
import { Button } from '@/components/ui/button';
import { Navigation, Loader2 } from 'lucide-react';
import { Logger } from '@/lib/logger';

interface UserLocationButtonProps {
  loadingLocation: boolean;
  onGetLocation: () => void;
}

const UserLocationButton = ({ loadingLocation, onGetLocation }: UserLocationButtonProps) => {
  Logger.component('UserLocationButton', `Rendering with loading: ${loadingLocation}`);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onGetLocation}
      disabled={loadingLocation}
      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
    >
      {loadingLocation ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Navigation className="h-4 w-4" />
      )}
    </Button>
  );
};

export default UserLocationButton;
