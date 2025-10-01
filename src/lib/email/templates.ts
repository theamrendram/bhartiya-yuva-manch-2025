import { welcomeTemplate } from './templates/welcome';
import { registrationApprovedTemplate } from './templates/registration-approved';
import { passwordResetTemplate } from './templates/password-reset';
import { paymentConfirmationTemplate } from './templates/payment-confirmation';
import { adminNotificationTemplate } from './templates/admin-notification';
import { finalNotificationTemplate } from './templates/final-notification';

// Template mapping
const templates: Record<string, (data: any) => string> = {
  welcome: welcomeTemplate,
  'registration-approved': registrationApprovedTemplate,
  'password-reset': passwordResetTemplate,
  'payment-confirmation': paymentConfirmationTemplate,
  'admin-notification': adminNotificationTemplate,
  'final-notification': finalNotificationTemplate,
};

// Main template renderer
export async function renderTemplate(templateName: string, data: any): Promise<string> {
  const template = templates[templateName];
  
  if (!template) {
    throw new Error(`Template '${templateName}' not found`);
  }
  
  return template(data);
}

// Base email template wrapper
export function createEmailWrapper(content: string, title?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title || 'R10 IEEE Computer Society Summer School 2025'}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .email-container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e9ecef;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #0066cc;
          margin-bottom: 10px;
        }
        .content {
          margin-bottom: 30px;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
          color: #6c757d;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #0066cc;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin: 10px 0;
        }
        .button:hover {
          background-color: #0052a3;
        }
        .highlight {
          background-color: #fff3cd;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #ffc107;
          margin: 15px 0;
        }
        .info-box {
          background-color: #d1ecf1;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #17a2b8;
          margin: 15px 0;
        }
        .success-box {
          background-color: #d4edda;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #28a745;
          margin: 15px 0;
        }
        @media only screen and (max-width: 600px) {
          body {
            padding: 10px;
          }
          .email-container {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">R10 IEEE Computer Society Summer School 2025</div>
          <div>Empowering Future Engineers</div>
        </div>
        
        <div class="content">
          ${content}
        </div>
        
        <div class="footer">
          <p>© 2025 R10 IEEE Computer Society Summer School 2025. All rights reserved.</p>
          <p>This email was sent to you because you registered for R10 IEEE Computer Society Summer School 2025.</p>
          <p>If you have any questions, please contact us at summer-school@bvicam.in</p>
        </div>
      </div>
    </body>
    </html>
  `;
} 