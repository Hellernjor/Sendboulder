
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Zap } from 'lucide-react';

const SubscriptionManagement = () => {
  return (
    <div className="space-y-6">
      {/* Free Plan Notice */}
      <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-300 dark:border-purple-600">
        <CardHeader>
          <CardTitle className="text-purple-800 dark:text-purple-200 flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            BoulderFlow is Completely Free!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-purple-700 dark:text-purple-300">
            We're building BoulderFlow based on your feedback. Enjoy all features at no cost while we perfect the experience together!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Unlimited route tracking',
              'Performance analytics',
              'Movement analysis',
              'Session tracking',
              'Progress insights',
              'Community features',
              'All future updates',
              'No hidden fees'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-purple-700 dark:text-purple-300">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feedback Request */}
      <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-300 dark:border-green-600">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Help Us Improve
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700 dark:text-green-300 mb-4">
            Your feedback is invaluable! Share your thoughts, suggestions, and ideas to help us build the perfect climbing companion.
          </p>
          <div className="text-sm text-green-600 dark:text-green-400">
            <p>• Report bugs or issues</p>
            <p>• Suggest new features</p>
            <p>• Share your climbing stories</p>
            <p>• Connect with our community</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;
