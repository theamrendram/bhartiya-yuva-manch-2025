import nodemailer from 'nodemailer';
import { renderTemplate } from './email/templates';
import { emailConfig, validateEmailConfig } from './email/config';

// Email configuration validation
const configValidation = validateEmailConfig();
if (!configValidation.isValid) {
  console.error('Email configuration errors:', configValidation.errors);
}

// Create transporter with configuration
const transporter = nodemailer.createTransport({
  service: emailConfig.smtp.service,
  host: emailConfig.smtp.host,
  port: emailConfig.smtp.port,
  secure: emailConfig.smtp.secure,
  auth: emailConfig.smtp.auth,
});

// Email sender interface
export interface EmailOptions {
  to: string | string[];
  subject: string;
  template: string;
  data?: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

// Main email sending function
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const { to, subject, template, data = {}, attachments = [] } = options;

    // Render the email template
    const htmlContent = await renderTemplate(template, data);

    const mailOptions = {
      from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html: htmlContent,
      attachments,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Convenience functions for common email types
export async function sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
  return sendEmail({
    to: userEmail,
    subject: 'Welcome to R10 IEEE Computer Society Summer School 2025!',
    template: emailConfig.templates.welcome,
    data: { userName },
  });
}

export async function sendRegistrationConfirmation(
  userEmail: string, 
  userName: string, 
  registrationData: any
): Promise<boolean> {
  return sendEmail({
    to: userEmail,
    subject: 'Registration Confirmed - R10 IEEE Computer Society Summer School 2025',
    template: emailConfig.templates.registrationConfirmation,
    data: { userName, registrationData },
  });
}

export async function sendPasswordReset(
  userEmail: string, 
  resetToken: string, 
  userName: string
): Promise<boolean> {
  const resetUrl = `${emailConfig.urls.baseUrl}${emailConfig.urls.resetPassword}?token=${resetToken}`;
  return sendEmail({
    to: userEmail,
    subject: 'Password Reset Request - R10 IEEE Computer Society Summer School 2025',
    template: emailConfig.templates.passwordReset,
    data: { userName, resetUrl },
  });
}

export async function sendPaymentConfirmation(
  userEmail: string, 
  userName: string, 
  paymentDetails: any
): Promise<boolean> {
  return sendEmail({
    to: userEmail,
    subject: 'Payment Confirmed - R10 IEEE Computer Society Summer School 2025',
    template: emailConfig.templates.paymentConfirmation,
    data: { userName, paymentDetails },
  });
}

export async function sendAdminNotification(
  adminEmail: string,
  notificationType: string,
  data: any
): Promise<boolean> {
  return sendEmail({
    to: adminEmail,
    subject: `Admin Notification: ${notificationType}`,
    template: emailConfig.templates.adminNotification,
    data: { notificationType, data },
  });
}

// Verify email configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
}

// Export configuration for use in other modules
export { emailConfig }; 