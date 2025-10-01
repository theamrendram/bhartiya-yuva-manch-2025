// Example integrations for the email system
// These show how to use the email system in different parts of your application

import {
  queueWelcomeEmail,
  queueRegistrationApproved,
  queuePasswordReset,
  queuePaymentConfirmation,
  queueAdminNotification
} from './queue';

// Example 1: User Registration Flow
export async function handleUserRegistration(userData: {
  email: string;
  name: string;
  registrationId: string;
}) {
  try {
    // Send welcome email immediately
    await queueWelcomeEmail(userData.email, userData.name);
    
    // Note: Registration approval with payment request will be sent separately by admin
    // after document review
    
    // Notify admin about new registration
    await queueAdminNotification(
      process.env.ADMIN_EMAIL || 'admin@ieeesummerschool.com',
      'New User Registration',
      {
        userId: userData.registrationId,
        email: userData.email,
        name: userData.name,
        timestamp: new Date().toISOString(),
        priority: 'Normal'
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Registration email error:', error);
    return { success: false, error: 'Failed to send registration emails' };
  }
}

// Example 2: Registration Approval with Payment Request Flow (Merged)
export async function handleRegistrationApproval(approvalData: {
  userEmail: string;
  userName: string;
  registrationId: string;
  paymentAmount: number;
  schedulePdfLink: string;
  qrCodeImage: string;
  paymentLink: string;
}) {
  try {
    // Send registration approved email with payment request
    await queueRegistrationApproved(
      approvalData.userEmail, 
      approvalData.userName, 
      {
        registrationData: {
          id: approvalData.registrationId,
          status: 'Approved',
          registrationDate: new Date().toISOString()
        },
        paymentAmount: approvalData.paymentAmount,
        schedulePdfLink: approvalData.schedulePdfLink,
        qrCodeImage: approvalData.qrCodeImage,
        paymentLink: approvalData.paymentLink
      }
    );
    
    // Notify admin about approval sent
    await queueAdminNotification(
      process.env.ADMIN_EMAIL || 'admin@ieeesummerschool.com',
      'Registration Approved',
      {
        userEmail: approvalData.userEmail,
        userName: approvalData.userName,
        registrationId: approvalData.registrationId,
        paymentAmount: approvalData.paymentAmount,
        timestamp: new Date().toISOString(),
        priority: 'Normal'
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Registration approval email error:', error);
    return { success: false, error: 'Failed to send registration approval email' };
  }
}

// Example 3: Payment Processing Flow
export async function handlePaymentSuccess(paymentData: {
  userEmail: string;
  userName: string;
  transactionId: string;
  amount: number;
  paymentMethod: string;
}) {
  try {
    // Send payment confirmation
    await queuePaymentConfirmation(paymentData.userEmail, paymentData.userName, {
      transactionId: paymentData.transactionId,
      amount: paymentData.amount.toFixed(2),
      method: paymentData.paymentMethod,
      paymentDate: new Date().toISOString(),
      status: 'Completed'
    });
    
    // Notify admin about successful payment
    await queueAdminNotification(
      process.env.ADMIN_EMAIL || 'admin@ieeesummerschool.com',
      'Payment Received',
      {
        transactionId: paymentData.transactionId,
        userEmail: paymentData.userEmail,
        userName: paymentData.userName,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        timestamp: new Date().toISOString(),
        priority: 'High'
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Payment email error:', error);
    return { success: false, error: 'Failed to send payment confirmation' };
  }
}

// Example 4: Password Reset Flow
export async function handlePasswordResetRequest(userData: {
  email: string;
  name: string;
  resetToken: string;
}) {
  try {
    // Send password reset email (high priority)
    await queuePasswordReset(userData.email, userData.resetToken, userData.name);
    
    // Log the reset request for security
    console.log(`Password reset requested for: ${userData.email}`);
    
    return { success: true };
  } catch (error) {
    console.error('Password reset email error:', error);
    return { success: false, error: 'Failed to send password reset email' };
  }
}

// Example 5: Course Registration Flow
export async function handleCourseRegistration(courseData: {
  userEmail: string;
  userName: string;
  courseName: string;
  courseId: string;
  startDate: string;
}) {
  try {
    // Notify course instructor about new registration
    await queueAdminNotification(
      process.env.INSTRUCTOR_EMAIL || 'instructor@ieeesummerschool.com',
      'New Course Registration',
      {
        courseId: courseData.courseId,
        courseName: courseData.courseName,
        studentEmail: courseData.userEmail,
        studentName: courseData.userName,
        startDate: courseData.startDate,
        timestamp: new Date().toISOString(),
        priority: 'Normal'
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Course registration email error:', error);
    return { success: false, error: 'Failed to send course registration emails' };
  }
}

// Example 6: Bulk Email Sending
export async function sendBulkAnnouncement(announcementData: {
  recipients: Array<{ email: string; name: string }>;
  subject: string;
  message: string;
}) {
  const results = [];
  
  for (const recipient of announcementData.recipients) {
    try {
      // Use queue for bulk sending to avoid rate limiting
      const emailId = await queueAdminNotification(
        recipient.email,
        announcementData.subject,
        {
          message: announcementData.message,
          recipientName: recipient.name,
          timestamp: new Date().toISOString(),
          priority: 'Low'
        }
      );
      
      results.push({
        email: recipient.email,
        success: true,
        emailId
      });
    } catch (error) {
      results.push({
        email: recipient.email,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  return {
    total: announcementData.recipients.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  };
}

// Example 7: Error Notification
export async function notifySystemError(errorData: {
  error: Error;
  context: string;
  userId?: string;
  userEmail?: string;
}) {
  try {
    await queueAdminNotification(
      process.env.ADMIN_EMAIL || 'admin@ieeesummerschool.com',
      'System Error Alert',
      {
        error: errorData.error.message,
        stack: errorData.error.stack,
        context: errorData.context,
        userId: errorData.userId,
        userEmail: errorData.userEmail,
        timestamp: new Date().toISOString(),
        priority: 'High'
      }
    );
    
    console.error('System error notification sent:', errorData);
  } catch (error) {
    console.error('Failed to send error notification:', error);
  }
}

// Example 8: Integration with NextAuth.js
export async function handleAuthEvents(event: string, user: any) {
  switch (event) {
    case 'signIn':
      // Send welcome email on first sign in
      if (user.firstLogin) {
        await queueWelcomeEmail(user.email, user.name);
      }
      break;
      
    case 'signUp':
      // Send welcome email for new registrations
      await queueWelcomeEmail(user.email, user.name);
      break;
      
    case 'signOut':
      // Could log sign out events
      console.log(`User signed out: ${user.email}`);
      break;
      
    default:
      break;
  }
}

// Example 9: Scheduled Email Tasks
export async function sendScheduledReminders() {
  // This could be called by a cron job or scheduled task
  const upcomingEvents: Array<{
    id: string;
    participantEmail: string;
    name: string;
    date: string;
    location: string;
    participantName: string;
  }> = [
    // Fetch from database
  ];
  
  for (const event of upcomingEvents) {
    try {
      await queueAdminNotification(
        event.participantEmail,
        'Event Reminder',
        {
          eventName: event.name,
          eventDate: event.date,
          eventLocation: event.location,
          participantName: event.participantName,
          priority: 'Normal'
        }
      );
    } catch (error) {
      console.error(`Failed to send reminder for event ${event.id}:`, error);
    }
  }
} 