import { sendEmail, EmailOptions } from '../email';

interface QueuedEmail extends EmailOptions {
  id: string;
  priority: 'high' | 'normal' | 'low';
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
}

class EmailQueue {
  private queue: QueuedEmail[] = [];
  private processing = false;
  private maxRetries = 3;
  private retryDelay = 5000; // 5 seconds

  // Add email to queue
  async addToQueue(emailOptions: EmailOptions, priority: 'high' | 'normal' | 'low' = 'normal'): Promise<string> {
    const queuedEmail: QueuedEmail = {
      ...emailOptions,
      id: this.generateId(),
      priority,
      retryCount: 0,
      maxRetries: this.maxRetries,
      createdAt: new Date(),
    };

    // Add to queue based on priority
    if (priority === 'high') {
      this.queue.unshift(queuedEmail);
    } else {
      this.queue.push(queuedEmail);
    }

    // Start processing if not already running
    if (!this.processing) {
      this.processQueue();
    }

    return queuedEmail.id;
  }

  // Process the email queue
  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const email = this.queue.shift();
      if (!email) continue;

      try {
        const success = await sendEmail(email);
        
        if (!success && email.retryCount < email.maxRetries) {
          // Retry with exponential backoff
          email.retryCount++;
          const delay = this.retryDelay * Math.pow(2, email.retryCount - 1);
          
          setTimeout(() => {
            this.queue.unshift(email);
            this.processQueue();
          }, delay);
        } else if (!success) {
          console.error(`Failed to send email after ${email.maxRetries} retries:`, email);
          // Could log to database or send to dead letter queue
        }
      } catch (error) {
        console.error('Error processing email:', error);
        
        if (email.retryCount < email.maxRetries) {
          email.retryCount++;
          const delay = this.retryDelay * Math.pow(2, email.retryCount - 1);
          
          setTimeout(() => {
            this.queue.unshift(email);
            this.processQueue();
          }, delay);
        }
      }

      // Small delay between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    this.processing = false;
  }

  // Get queue status
  getQueueStatus(this: EmailQueue): {
    total: number;
    processing: boolean;
    highPriority: number;
    normalPriority: number;
    lowPriority: number;
  } {
    const highPriority = this.queue.filter(email => email.priority === 'high').length;
    const normalPriority = this.queue.filter(email => email.priority === 'normal').length;
    const lowPriority = this.queue.filter(email => email.priority === 'low').length;

    return {
      total: this.queue.length,
      processing: this.processing,
      highPriority,
      normalPriority,
      lowPriority,
    };
  }

  // Clear queue (useful for testing)
  clearQueue(this: EmailQueue): void {
    this.queue = [];
  }

  // Generate unique ID for email tracking
  private generateId(this: EmailQueue): string {
    return `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Create singleton instance
const emailQueue = new EmailQueue();

// Convenience functions
async function queueWelcomeEmail(userEmail: string, userName: string): Promise<string> {
  return emailQueue.addToQueue({
    to: userEmail,
    subject: 'Welcome to R10 IEEE Computer Society Summer School 2025!',
    template: 'welcome',
    data: { userName },
  }, 'high');
}

async function queueRegistrationConfirmation(
  userEmail: string, 
  userName: string, 
  registrationData: any
): Promise<string> {
  return emailQueue.addToQueue({
    to: userEmail,
    subject: 'Registration Confirmed - R10 IEEE Computer Society Summer School 2025',
    template: 'registration-confirmation',
    data: { userName, registrationData },
  }, 'high');
}

async function queueRegistrationApproved(
  userEmail: string, 
  userName: string, 
  data: {
    registrationData: any;
    paymentAmount: number;
    schedulePdfLink: string;
    qrCodeImage: string;
    paymentLink: string;
  }
): Promise<string> {
  return emailQueue.addToQueue({
    to: userEmail,
    subject: 'Registration Approved - R10 IEEE Computer Society Summer School 2025',
    template: 'registration-approved',
    data: { 
      userName, 
      registrationData: data.registrationData,
      paymentAmount: data.paymentAmount,
      schedulePdfLink: data.schedulePdfLink,
      qrCodeImage: data.qrCodeImage,
      paymentLink: data.paymentLink
    },
  }, 'high');
}

async function queuePasswordReset(
  userEmail: string, 
  resetToken: string, 
  userName: string
): Promise<string> {
  return emailQueue.addToQueue({
    to: userEmail,
    subject: 'Password Reset Request - R10 IEEE Computer Society Summer School 2025',
    template: 'password-reset',
    data: { userName, resetToken },
  }, 'high');
}

async function queuePaymentConfirmation(
  userEmail: string, 
  userName: string, 
  paymentDetails: any
): Promise<string> {
  return emailQueue.addToQueue({
    to: userEmail,
    subject: 'Payment Confirmed - R10 IEEE Computer Society Summer School 2025',
    template: 'payment-confirmation',
    data: { userName, paymentDetails },
  }, 'normal');
}

async function queuePaymentRequest(
  userEmail: string, 
  userName: string, 
  paymentData: {
    paymentAmount: number;
    schedulePdfLink: string;
    qrCodeImage: string;
    paymentLink: string;
  }
): Promise<string> {
  return emailQueue.addToQueue({
    to: userEmail,
    subject: 'Payment Request - R10 IEEE Computer Society Summer School 2025',
    template: 'payment-request',
    data: { 
      userName, 
      paymentAmount: paymentData.paymentAmount,
      schedulePdfLink: paymentData.schedulePdfLink,
      qrCodeImage: paymentData.qrCodeImage,
      paymentLink: paymentData.paymentLink
    },
  }, 'high');
}

async function queueAdminNotification(
  adminEmail: string,
  notificationType: string,
  data: any
): Promise<string> {
  return emailQueue.addToQueue({
    to: adminEmail,
    subject: `Admin Notification: ${notificationType}`,
    template: 'admin-notification',
    data: { notificationType, data },
  }, 'low');
}

async function queueFinalNotification(
  userEmail: string, 
  userName: string, 
  registrationData: any
): Promise<string> {
  return emailQueue.addToQueue({
    to: userEmail,
    subject: 'Final Notification - R10 IEEE Computer Society Summer School 2025',
    template: 'final-notification',
    data: { userName, registrationData },
  }, 'normal');
}

// Export queue status function
export function getQueueStatus() {
  return emailQueue.getQueueStatus();
}

export { 
  emailQueue, 
  queueWelcomeEmail, 
  queueRegistrationApproved, 
  queuePasswordReset, 
  queuePaymentConfirmation, 
  queueAdminNotification,
  queueFinalNotification
};