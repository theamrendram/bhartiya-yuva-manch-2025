# Email System Documentation

This document describes the modular email system implemented for the R10 IEEE Computer Society Summer School 2025 project.

## Overview

The email system is built with Nodemailer and provides:
- Modular template system
- Email queue with priority handling
- Retry mechanism with exponential backoff
- Environment-specific configuration
- Comprehensive error handling

## Email Flow

The system follows this simplified email flow for the 5-day summer school:

1. **Welcome Email** - Sent after registration, informing users to wait for document review
2. **Registration Approved Email** - Sent after approval, includes registration confirmation, schedule PDF link, QR code, and payment amount
3. **Payment Confirmation Email** - Sent after manual payment verification

## Architecture

```
src/lib/email/
├── email.ts              # Main email functionality
├── config.ts             # Configuration management
├── queue.ts              # Email queue system
├── templates.ts          # Template renderer
├── templates/            # Individual email templates
│   ├── index.ts
│   ├── welcome.ts
│   ├── registration-approved.ts
│   ├── password-reset.ts
│   ├── payment-confirmation.ts
│   └── admin-notification.ts
└── README.md
```

## Configuration

### Environment Variables

Add these to your `.env.local` file:

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=R10 IEEE Computer Society Summer School 2025

# Support Information
SUPPORT_EMAIL=support@ieeesummerschool.com
SUPPORT_PHONE=+1-555-0123

# Application URL
NEXTAUTH_URL=http://localhost:3000
```

### Gmail Setup

For Gmail, you'll need to:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password as `EMAIL_PASSWORD`

## Usage

### Basic Email Sending

```typescript
import { sendEmail } from '@/lib/email';

// Send a simple email
const success = await sendEmail({
  to: 'user@example.com',
  subject: 'Test Email',
  template: 'welcome',
  data: { userName: 'John Doe' }
});
```

### Convenience Functions

```typescript
import { 
  sendWelcomeEmail,
  sendRegistrationApproved,
  sendPasswordReset,
  sendPaymentConfirmation,
  sendAdminNotification
} from '@/lib/email';

// Send welcome email
await sendWelcomeEmail('user@example.com', 'John Doe');

// Send registration approved with payment request
await sendRegistrationApproved('user@example.com', 'John Doe', {
  registrationData: {
    id: 'REG123',
    status: 'Approved',
    registrationDate: new Date().toISOString()
  },
  paymentAmount: 299.99,
  schedulePdfLink: 'https://example.com/schedule.pdf',
  qrCodeImage: 'https://example.com/qr-code.png',
  paymentLink: 'https://example.com/pay'
});

// Send password reset
await sendPasswordReset('user@example.com', 'reset-token-123', 'John Doe');

// Send payment confirmation
await sendPaymentConfirmation('user@example.com', 'John Doe', {
  transactionId: 'TXN123',
  amount: '299.99',
  method: 'Credit Card'
});

// Send admin notification
await sendAdminNotification('admin@example.com', 'New Registration', {
  userId: '123',
  email: 'user@example.com'
});
```

### Using the Queue System

```typescript
import { 
  queueWelcomeEmail,
  queueRegistrationApproved,
  queuePasswordReset,
  emailQueue,
  getQueueStatus
} from '@/lib/email/queue';

// Queue an email (recommended for production)
const emailId = await queueWelcomeEmail('user@example.com', 'John Doe');

// Queue registration approved with payment request
const approvalId = await queueRegistrationApproved('user@example.com', 'John Doe', {
  registrationData: {
    id: 'REG123',
    status: 'Approved',
    registrationDate: new Date().toISOString()
  },
  paymentAmount: 299.99,
  schedulePdfLink: 'https://example.com/schedule.pdf',
  qrCodeImage: 'https://example.com/qr-code.png',
  paymentLink: 'https://example.com/pay'
});

// Check queue status
const status = getQueueStatus();
console.log(status);
// {
//   total: 5,
//   processing: true,
//   highPriority: 2,
//   normalPriority: 2,
//   lowPriority: 1
// }

// Add custom email to queue
const customEmailId = await emailQueue.addToQueue({
  to: 'user@example.com',
  subject: 'Custom Email',
  template: 'welcome',
  data: { userName: 'John Doe' }
}, 'high'); // Priority: 'high' | 'normal' | 'low'
```

## Email Templates

### Available Templates

1. **welcome** - Welcome email for new users (wait for document review)
2. **registration-approved** - Registration approval with payment request (merged template)
3. **password-reset** - Password reset request
4. **payment-confirmation** - Payment confirmation after manual verification
5. **admin-notification** - Admin notifications

### Template Data Structure

Each template expects specific data:

```typescript
// Welcome template
{ userName: string }

// Registration approved (merged template)
{ 
  userName: string;
  registrationData: {
    id: string;
    status: string;
    registrationDate: string;
  };
  paymentAmount: number;
  schedulePdfLink: string;
  qrCodeImage: string;
  paymentLink: string;
}

// Password reset
{
  userName: string;
  resetUrl: string; // Generated automatically
}

// Payment confirmation
{
  userName: string;
  paymentDetails: {
    transactionId: string;
    amount: string;
    method: string;
    // ... other payment details
  }
}

// Admin notification
{
  notificationType: string;
  data: any; // Flexible data structure
}
```

### Creating New Templates

1. Create a new template file in `src/lib/email/templates/`:

```typescript
// src/lib/email/templates/new-template.ts
import { createEmailWrapper } from '../templates';

export function newTemplateTemplate(data: { userName: string }): string {
  const content = `
    <h2>New Template</h2>
    <p>Hello ${data.userName}!</p>
    <p>This is a new email template.</p>
  `;
  
  return createEmailWrapper(content, 'New Template');
}
```

2. Add it to the template mapping in `src/lib/email/templates.ts`:

```typescript
import { newTemplateTemplate } from './templates/new-template';

const templates: Record<string, (data: any) => string> = {
  // ... existing templates
  'new-template': newTemplateTemplate,
};
```

3. Add it to the configuration in `src/lib/email/config.ts`:

```typescript
templates: {
  // ... existing templates
  newTemplate: 'new-template',
},
```

## Testing

### Test API Endpoint

Use the test endpoint at `/api/email/test`:

```bash
# Check system status
GET /api/email/test

# Send test email
POST /api/email/test
{
  "email": "test@example.com",
  "template": "welcome",
  "data": { "userName": "Test User" },
  "useQueue": false
}
```

### Test Page

Visit `/admin/email-test` for a web interface to test emails.

## Error Handling

The system includes comprehensive error handling:

- **Configuration validation** - Checks required environment variables
- **SMTP verification** - Validates email server connection
- **Retry mechanism** - Automatically retries failed emails with exponential backoff
- **Queue management** - Handles email queuing and processing
- **Template validation** - Ensures templates exist before sending

## Performance Considerations

- **Queue system** - Prevents blocking on email sending
- **Rate limiting** - Configurable delays between emails
- **Priority handling** - High-priority emails processed first
- **Retry limits** - Prevents infinite retry loops
- **Memory management** - Queue size monitoring

## Security

- **Environment variables** - Sensitive data stored in environment variables
- **Input validation** - Email addresses and data validated
- **Template sanitization** - HTML content properly escaped
- **Rate limiting** - Prevents email spam

## Monitoring

Monitor the email system through:

1. **Console logs** - Email sending status and errors
2. **Queue status** - Current queue state and processing status
3. **API endpoints** - System health checks
4. **Test page** - Manual testing interface

## Troubleshooting

### Common Issues

1. **"Email configuration is invalid"**
   - Check environment variables
   - Verify SMTP settings
   - Test with `verifyEmailConfig()`

2. **"Template not found"**
   - Ensure template exists in mapping
   - Check template file imports
   - Verify template name spelling

3. **"Failed to send email"**
   - Check SMTP credentials
   - Verify network connectivity
   - Review email server logs

4. **Queue not processing**
   - Check if queue is stuck
   - Restart application
   - Review error logs

### Debug Mode

Enable debug logging by setting:

```env
DEBUG=email:*
```

## Production Deployment

For production:

1. **Use queue system** - Always use `queue*` functions
2. **Configure proper SMTP** - Use production email service
3. **Set up monitoring** - Monitor queue status and errors
4. **Configure retries** - Adjust retry settings for production
5. **Set up logging** - Implement proper logging system

## Support

For issues or questions:
- Check this documentation
- Review console logs
- Test with the test page
- Contact the development team 

## Admin Approval & Payment Link API

Use the following endpoint to approve a user and/or send a payment link:

### Endpoint
`POST /api/admin/users/approve-registration`

#### Request Body
- `userId` (required)
- `paymentAmount` (optional, overrides default)
- `schedulePdfLink` (optional, overrides default)
- `qrCodeImage` (optional, overrides default)
- `paymentLink` (optional, overrides default)

If optional fields are not provided, sensible defaults are used.

#### Example
```bash
POST /api/admin/users/approve-registration
{
  "userId": "USER_ID_HERE",
  "paymentAmount": 1700, // optional
  "schedulePdfLink": "https://example.com/schedule.pdf", // optional
  "qrCodeImage": "https://example.com/qr.png", // optional
  "paymentLink": "https://example.com/pay" // optional
}
```

This endpoint replaces the previous `send-payment-request` and `verify` endpoints. 

# Email Queuing System

This document explains how the email queuing system works in the R10 IEEE Computer Society Summer School 2025 application.

## Overview

The email queuing system is designed to handle email sending in a reliable, scalable, and fault-tolerant manner. It provides:

- **Asynchronous Processing**: Emails are queued and processed in the background
- **Priority-based Queuing**: High, normal, and low priority emails
- **Retry Mechanism**: Automatic retry with exponential backoff
- **Rate Limiting**: Prevents overwhelming email providers
- **Error Handling**: Graceful handling of failures
- **Monitoring**: Queue status and metrics

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Application   │───▶│   Email Queue   │───▶│  Email Service  │
│   (API Routes)  │    │   (In-Memory)   │    │   (Nodemailer)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Templates     │
                       │   (HTML/Text)   │
                       └─────────────────┘
```

## Components

### 1. Email Queue (`queue.ts`)

The core queuing system implemented as a singleton class:

```typescript
class EmailQueue {
  private queue: QueuedEmail[] = [];
  private processing = false;
  private maxRetries = 3;
  private retryDelay = 5000; // 5 seconds
}
```

**Key Features:**
- **Priority-based queuing**: High priority emails are processed first
- **Automatic retry**: Failed emails are retried with exponential backoff
- **Rate limiting**: 1-second delay between emails
- **Error handling**: Failed emails after max retries are logged

### 2. Email Service (`email.ts`)

The actual email sending service using Nodemailer:

```typescript
export async function sendEmail(options: EmailOptions): Promise<boolean>
```

**Features:**
- SMTP configuration via environment variables
- Template rendering
- Attachment support
- Error handling and logging

### 3. Email Configuration (`config.ts`)

Centralized configuration management:

```typescript
export const emailConfig = {
  smtp: { /* SMTP settings */ },
  queue: { /* Queue settings */ },
  templates: { /* Template mappings */ },
  urls: { /* Application URLs */ }
}
```

### 4. Template System (`templates.ts`)

HTML email template rendering:

```typescript
export async function renderTemplate(templateName: string, data: any): Promise<string>
```

**Features:**
- Responsive HTML templates
- Consistent branding
- Template data injection
- Error handling for missing templates

## How It Works

### 1. Adding Emails to Queue

```typescript
// High priority email (processed first)
await queueWelcomeEmail(userEmail, userName);

// Normal priority email
await queuePaymentConfirmation(userEmail, userName, paymentDetails);

// Low priority email (processed last)
await queueAdminNotification(adminEmail, notificationType, data);
```

### 2. Queue Processing

The queue processes emails in this order:

1. **High Priority**: Welcome emails, password resets, payment requests
2. **Normal Priority**: Payment confirmations, registration confirmations
3. **Low Priority**: Admin notifications, system alerts

### 3. Retry Mechanism

When an email fails to send:

1. **First retry**: After 5 seconds
2. **Second retry**: After 10 seconds (2x delay)
3. **Third retry**: After 20 seconds (4x delay)
4. **Final failure**: Logged as error after max retries

### 4. Rate Limiting

- **Delay between emails**: 1 second (configurable)
- **Purpose**: Prevents overwhelming email providers
- **Configurable**: Different delays for different environments

## Usage Examples

### Basic Email Queuing

```typescript
import { emailQueue } from '@/lib/email/queue';

// Add email to queue
const emailId = await emailQueue.addToQueue({
  to: 'user@example.com',
  subject: 'Welcome!',
  template: 'welcome',
  data: { userName: 'John Doe' }
}, 'high');
```

### Convenience Functions

```typescript
import { 
  queueWelcomeEmail,
  queuePasswordReset,
  queuePaymentConfirmation 
} from '@/lib/email/queue';

// Welcome email
await queueWelcomeEmail('user@example.com', 'John Doe');

// Password reset
await queuePasswordReset('user@example.com', 'reset-token', 'John Doe');

// Payment confirmation
await queuePaymentConfirmation('user@example.com', 'John Doe', paymentDetails);
```

### Queue Monitoring

```typescript
import { getQueueStatus } from '@/lib/email/queue';

const status = getQueueStatus();
console.log(status);
// Output:
// {
//   total: 15,
//   processing: true,
//   highPriority: 3,
//   normalPriority: 10,
//   lowPriority: 2
// }
```

## Configuration

### Environment Variables

```bash
# SMTP Configuration
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Email Settings
EMAIL_FROM_NAME="R10 IEEE Computer Society Summer School 2025"
EMAIL_FROM=your-email@gmail.com

# Application URLs
NEXTAUTH_URL=http://localhost:3000

# Support
SUPPORT_EMAIL=support@ieeesummerschool.com
SUPPORT_PHONE=+1-555-0123
```

### Queue Settings

```typescript
// Development
queue: {
  maxRetries: 3,
  retryDelay: 5000,
  delayBetweenEmails: 1000
}

// Production
queue: {
  maxRetries: 5,
  retryDelay: 10000,
  delayBetweenEmails: 2000
}
```

## Available Email Templates

### 1. Welcome Email
- **Template**: `welcome`
- **Priority**: High
- **Data**: `{ userName }`
- **Purpose**: Sent when user registers

### 2. Registration Approved
- **Template**: `registration-approved`
- **Priority**: High
- **Data**: `{ userName, registrationData, paymentAmount, schedulePdfLink, qrCodeImage, paymentLink }`
- **Purpose**: Sent when admin approves registration

### 3. Password Reset
- **Template**: `password-reset`
- **Priority**: High
- **Data**: `{ userName, resetToken }`
- **Purpose**: Sent when user requests password reset

### 4. Payment Confirmation
- **Template**: `payment-confirmation`
- **Priority**: Normal
- **Data**: `{ userName, paymentDetails }`
- **Purpose**: Sent when payment is confirmed

### 5. Admin Notification
- **Template**: `admin-notification`
- **Priority**: Low
- **Data**: `{ notificationType, data }`
- **Purpose**: Sent to admins for system events

## Error Handling

### Email Sending Failures

1. **Network Issues**: Retried automatically
2. **Invalid Email**: Logged and skipped
3. **Template Errors**: Logged with template name
4. **SMTP Errors**: Retried with backoff

### Queue Failures

1. **Memory Issues**: Queue cleared on restart
2. **Processing Errors**: Individual email failures don't stop queue
3. **Configuration Errors**: Validated at startup

## Monitoring and Debugging

### Queue Status

```typescript
const status = getQueueStatus();
// Monitor queue health and performance
```

### Logging

The system logs:
- Successful email sends
- Failed email attempts
- Retry attempts
- Configuration errors
- Template rendering errors

### Testing

```typescript
// Test email configuration
import { verifyEmailConfig } from '@/lib/email';
const isValid = await verifyEmailConfig();

// Clear queue for testing
emailQueue.clearQueue();
```

## Best Practices

### 1. Priority Usage
- **High**: Time-sensitive emails (welcome, password reset)
- **Normal**: Confirmation emails (payment, registration)
- **Low**: Notifications and alerts

### 2. Error Handling
- Always check return values from queue functions
- Monitor queue status in production
- Set up alerts for queue failures

### 3. Performance
- Use appropriate priorities
- Monitor queue size
- Adjust delays based on email provider limits

### 4. Security
- Validate email addresses
- Sanitize template data
- Use environment variables for sensitive config

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check SMTP configuration
   - Verify email credentials
   - Check queue status

2. **Queue not processing**
   - Check if processing flag is stuck
   - Restart application
   - Clear queue if needed

3. **Template errors**
   - Verify template exists
   - Check template data format
   - Validate HTML syntax

### Debug Commands

```typescript
// Check email configuration
await verifyEmailConfig();

// Get queue status
const status = getQueueStatus();

// Clear queue (development only)
emailQueue.clearQueue();
```

## Future Enhancements

1. **Database Persistence**: Store queue in database for persistence
2. **Dead Letter Queue**: Handle permanently failed emails
3. **Metrics Dashboard**: Real-time queue monitoring
4. **Bulk Email Support**: Send to multiple recipients efficiently
5. **Email Analytics**: Track open rates and click-through rates
6. **Template Management**: Admin interface for template editing
7. **Rate Limiting**: Per-recipient rate limiting
8. **Email Scheduling**: Send emails at specific times

## Dependencies

- `nodemailer`: Email sending
- `@types/nodemailer`: TypeScript types
- Environment variables for configuration
- HTML/CSS for email templates

## Security Considerations

1. **SMTP Credentials**: Stored in environment variables
2. **Email Validation**: Validate recipient addresses
3. **Template Sanitization**: Sanitize user data in templates
4. **Rate Limiting**: Prevent email abuse
5. **Error Logging**: Don't log sensitive data

This email queuing system provides a robust, scalable solution for handling email communications in the IEEE Summer School application. 