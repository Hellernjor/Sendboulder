
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CreditCard, Calendar, AlertTriangle, Crown, X } from 'lucide-react';

const SubscriptionManagement = () => {
  const [subscription] = useState({
    status: 'trial', // 'trial', 'active', 'cancelled', 'expired'
    plan: 'Pro',
    price: 19.95,
    trialDaysLeft: 8,
    nextBilling: '2024-07-15',
    paymentMethod: '**** **** **** 4242'
  });

  const trialProgress = ((14 - subscription.trialDaysLeft) / 14) * 100;

  const handleUpgrade = () => {
    console.log('Starting subscription upgrade');
    // TODO: Implement Stripe checkout
  };

  const handleCancelSubscription = () => {
    console.log('Cancelling subscription');
    // TODO: Implement cancellation
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Crown className="h-5 w-5 text-orange-400" />
            Current Plan
          </CardTitle>
          <Badge 
            variant={subscription.status === 'trial' ? 'secondary' : 'default'}
            className={
              subscription.status === 'trial' 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'bg-green-500/20 text-green-400'
            }
          >
            {subscription.status === 'trial' ? 'Free Trial' : 'Pro Plan'}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscription.status === 'trial' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Trial Progress</span>
                <span className="text-white">{subscription.trialDaysLeft} days left</span>
              </div>
              <Progress value={trialProgress} className="h-2" />
              <p className="text-sm text-slate-300">
                Your free trial ends in {subscription.trialDaysLeft} days. Upgrade to continue using BoulderFlow.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Plan</p>
              <p className="text-white font-medium">{subscription.plan}</p>
            </div>
            <div>
              <p className="text-slate-400">Price</p>
              <p className="text-white font-medium">${subscription.price}/month</p>
            </div>
            {subscription.status !== 'trial' && (
              <>
                <div>
                  <p className="text-slate-400">Next Billing</p>
                  <p className="text-white font-medium">{subscription.nextBilling}</p>
                </div>
                <div>
                  <p className="text-slate-400">Payment Method</p>
                  <p className="text-white font-medium">{subscription.paymentMethod}</p>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3">
            {subscription.status === 'trial' ? (
              <Button onClick={handleUpgrade} className="bg-orange-600 hover:bg-orange-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Upgrade to Pro - $19.95/month
              </Button>
            ) : (
              <>
                <Button variant="outline" className="border-slate-600 text-slate-300">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Update Payment Method
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancelSubscription}
                  className="border-red-600 text-red-400 hover:bg-red-600/10"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel Subscription
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Pro Plan Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Unlimited route analysis',
              'Advanced performance tracking',
              'AI-powered movement feedback',
              'Session video analysis',
              'Progress insights & trends',
              'Custom training programs',
              'Premium support',
              'Export climbing data'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {subscription.status === 'trial' ? (
              <p className="text-slate-400 text-center py-4">
                No billing history yet. Your first charge will be on {subscription.nextBilling}.
              </p>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-slate-700">
                  <div>
                    <p className="text-white">Pro Plan</p>
                    <p className="text-sm text-slate-400">June 2024</p>
                  </div>
                  <p className="text-white">${subscription.price}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;
