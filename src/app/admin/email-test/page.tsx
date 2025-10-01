'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface EmailStatus {
  configValid: boolean;
  queueStatus: {
    total: number;
    processing: boolean;
    highPriority: number;
    normalPriority: number;
    lowPriority: number;
  };
  availableTemplates: string[];
}

export default function EmailTestPage() {
  const [email, setEmail] = useState('');
  const [template, setTemplate] = useState('welcome');
  const [useQueue, setUseQueue] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [status, setStatus] = useState<EmailStatus | null>(null);

  const templates = [
    { value: 'welcome', label: 'Welcome Email' },
    { value: 'registration-confirmation', label: 'Registration Confirmation' },
    { value: 'password-reset', label: 'Password Reset' },
    { value: 'payment-confirmation', label: 'Payment Confirmation' },
    { value: 'admin-notification', label: 'Admin Notification' },
  ];

  const testData = {
    welcome: { userName: 'Test User' },
    'registration-confirmation': { 
      userName: 'Test User', 
      registrationData: { id: 'TEST123', status: 'Confirmed' } 
    },
    'password-reset': { 
      userName: 'Test User', 
      resetToken: 'test-token-123' 
    },
    'payment-confirmation': { 
      userName: 'Test User', 
      paymentDetails: { 
        transactionId: 'TXN123', 
        amount: '299.99', 
        method: 'Credit Card' 
      } 
    },
    'admin-notification': { 
      notificationType: 'New Registration', 
      data: { 
        userId: '123', 
        email: 'test@example.com',
        priority: 'Normal' 
      } 
    },
  };

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/email/test');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };

  const sendTestEmail = async () => {
    if (!email || !template) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          template,
          useQueue,
          data: testData[template as keyof typeof testData],
        }),
      });

      const data = await response.json();
      setResult(data);

      // Refresh status after sending
      await checkStatus();
    } catch (error) {
      setResult({ error: 'Failed to send email' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Email System Test</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Test Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send Test Email</CardTitle>
            <CardDescription>
              Test the email system with different templates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>

            <div>
              <Label htmlFor="template">Template</Label>
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="useQueue"
                checked={useQueue}
                onCheckedChange={(checked) => setUseQueue(checked as boolean)}
              />
              <Label htmlFor="useQueue">Use Queue System</Label>
            </div>

            <Button 
              onClick={sendTestEmail} 
              disabled={loading || !email}
              className="w-full"
            >
              {loading ? 'Sending...' : 'Send Test Email'}
            </Button>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Current email system status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={checkStatus} variant="outline" className="w-full">
              Refresh Status
            </Button>

            {status && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${status.configValid ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span>Configuration: {status.configValid ? 'Valid' : 'Invalid'}</span>
                </div>

                <div className="border rounded p-3">
                  <h4 className="font-semibold mb-2">Queue Status</h4>
                  <div className="text-sm space-y-1">
                    <div>Total: {status.queueStatus.total}</div>
                    <div>Processing: {status.queueStatus.processing ? 'Yes' : 'No'}</div>
                    <div>High Priority: {status.queueStatus.highPriority}</div>
                    <div>Normal Priority: {status.queueStatus.normalPriority}</div>
                    <div>Low Priority: {status.queueStatus.lowPriority}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Result */}
      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Template Preview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Template Preview</CardTitle>
          <CardDescription>
            Sample data for the selected template
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(testData[template as keyof typeof testData], null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
} 