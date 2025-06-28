
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Mail, Smartphone, TrendingUp } from 'lucide-react';

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    email: {
      progressUpdates: true,
      weeklyReports: true,
      newFeatures: false,
      marketingEmails: false
    },
    push: {
      sessionReminders: true,
      achievementUnlocked: true,
      friendRequests: false,
      socialUpdates: false
    },
    inApp: {
      routeAnalysis: true,
      performanceInsights: true,
      tips: true
    }
  });

  const updateNotification = (category: keyof typeof notifications, setting: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
    console.log('Updating notification preference:', { category, setting, value });
    // TODO: Implement with Supabase
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'progressUpdates', label: 'Progress Updates', description: 'Weekly climbing progress summaries' },
            { key: 'weeklyReports', label: 'Weekly Reports', description: 'Detailed performance analytics' },
            { key: 'newFeatures', label: 'New Features', description: 'Updates about new app features' },
            { key: 'marketingEmails', label: 'Marketing Emails', description: 'Promotional content and tips' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <Label htmlFor={`email-${item.key}`} className="text-white cursor-pointer">
                  {item.label}
                </Label>
                <p className="text-sm text-slate-400">{item.description}</p>
              </div>
              <Switch
                id={`email-${item.key}`}
                checked={notifications.email[item.key as keyof typeof notifications.email]}
                onCheckedChange={(checked) => updateNotification('email', item.key, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'sessionReminders', label: 'Session Reminders', description: 'Reminders to log your climbing sessions' },
            { key: 'achievementUnlocked', label: 'Achievement Unlocked', description: 'When you reach new milestones' },
            { key: 'friendRequests', label: 'Friend Requests', description: 'Social notifications from other climbers' },
            { key: 'socialUpdates', label: 'Social Updates', description: 'Updates from friends and community' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <Label htmlFor={`push-${item.key}`} className="text-white cursor-pointer">
                  {item.label}
                </Label>
                <p className="text-sm text-slate-400">{item.description}</p>
              </div>
              <Switch
                id={`push-${item.key}`}
                checked={notifications.push[item.key as keyof typeof notifications.push]}
                onCheckedChange={(checked) => updateNotification('push', item.key, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="h-5 w-5" />
            In-App Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'routeAnalysis', label: 'Route Analysis Complete', description: 'When AI finishes analyzing your routes' },
            { key: 'performanceInsights', label: 'Performance Insights', description: 'New insights about your climbing' },
            { key: 'tips', label: 'Climbing Tips', description: 'Personalized tips and suggestions' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <Label htmlFor={`app-${item.key}`} className="text-white cursor-pointer">
                  {item.label}
                </Label>
                <p className="text-sm text-slate-400">{item.description}</p>
              </div>
              <Switch
                id={`app-${item.key}`}
                checked={notifications.inApp[item.key as keyof typeof notifications.inApp]}
                onCheckedChange={(checked) => updateNotification('inApp', item.key, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
