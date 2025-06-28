
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save } from 'lucide-react';

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    name: 'Alex Chen',
    email: 'alex@example.com',
    climbingGrade: 'V6',
    preferredGym: 'Brooklyn Boulders',
    avatar: ''
  });

  const handleSave = () => {
    console.log('Saving profile:', profile);
    // TODO: Implement with Supabase
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="bg-orange-500 text-white text-xl">
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" className="border-slate-600 text-slate-300">
              <Camera className="h-4 w-4 mr-2" />
              Change Photo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-slate-300">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="grade" className="text-slate-300">Current Grade</Label>
              <Input
                id="grade"
                value={profile.climbingGrade}
                onChange={(e) => setProfile({...profile, climbingGrade: e.target.value})}
                className="bg-slate-700/50 border-slate-600 text-white"
                placeholder="e.g., V6, 5.11a"
              />
            </div>

            <div>
              <Label htmlFor="gym" className="text-slate-300">Preferred Gym</Label>
              <Input
                id="gym"
                value={profile.preferredGym}
                onChange={(e) => setProfile({...profile, preferredGym: e.target.value})}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
          </div>

          <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
