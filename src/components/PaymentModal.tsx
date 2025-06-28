
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Lock, Shield, CheckCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal = ({ isOpen, onClose, onSuccess }: PaymentModalProps) => {
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    name: '',
    email: '',
    country: 'US'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
      onClose();
    }, 2000);
    
    console.log('Processing payment:', paymentForm);
    // TODO: Implement Stripe payment processing
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-orange-400" />
            Subscribe to BoulderFlow Pro
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Summary */}
          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">BoulderFlow Pro</span>
                <span className="font-bold">$19.95/month</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle className="h-4 w-4 text-green-400" />
                14-day free trial included
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card Information */}
            <div>
              <Label htmlFor="cardNumber" className="text-slate-300">Card Number</Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={paymentForm.cardNumber}
                onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
                className="bg-slate-700/50 border-slate-600 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="expiryMonth" className="text-slate-300">Month</Label>
                <Input
                  id="expiryMonth"
                  type="text"
                  placeholder="MM"
                  value={paymentForm.expiryMonth}
                  onChange={(e) => setPaymentForm({...paymentForm, expiryMonth: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="expiryYear" className="text-slate-300">Year</Label>
                <Input
                  id="expiryYear"
                  type="text"
                  placeholder="YY"
                  value={paymentForm.expiryYear}
                  onChange={(e) => setPaymentForm({...paymentForm, expiryYear: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvc" className="text-slate-300">CVC</Label>
                <Input
                  id="cvc"
                  type="text"
                  placeholder="123"
                  value={paymentForm.cvc}
                  onChange={(e) => setPaymentForm({...paymentForm, cvc: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  required
                />
              </div>
            </div>

            {/* Billing Information */}
            <div>
              <Label htmlFor="name" className="text-slate-300">Cardholder Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={paymentForm.name}
                onChange={(e) => setPaymentForm({...paymentForm, name: e.target.value})}
                className="bg-slate-700/50 border-slate-600 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={paymentForm.email}
                onChange={(e) => setPaymentForm({...paymentForm, email: e.target.value})}
                className="bg-slate-700/50 border-slate-600 text-white"
                required
              />
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Shield className="h-4 w-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Start Free Trial
                </>
              )}
            </Button>

            <p className="text-xs text-slate-400 text-center">
              You won't be charged until your 14-day free trial ends. Cancel anytime.
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
