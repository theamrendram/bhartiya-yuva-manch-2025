// Email configuration
export const emailConfig = {
  // SMTP Configuration
  smtp: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  },

  // Email settings
  from: {
    name: process.env.EMAIL_FROM_NAME || 'R10 IEEE Computer Society Summer School 2025',
    email: process.env.EMAIL_FROM || process.env.EMAIL_USER,
  },

  // Queue settings
  queue: {
    maxRetries: 3,
    retryDelay: 5000, // 5 seconds
    delayBetweenEmails: 1000, // 1 second
  },

  // Templates
  templates: {
    welcome: 'welcome',
    registrationConfirmation: 'registration-confirmation',
    passwordReset: 'password-reset',
    paymentConfirmation: 'payment-confirmation',
    adminNotification: 'admin-notification',
  },

  // URLs
  urls: {
    baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    resetPassword: '/reset-password',
    verifyEmail: '/verify-email',
  },

  // Support
  support: {
    email: process.env.SUPPORT_EMAIL || 'support@ieeesummerschool.com',
    phone: process.env.SUPPORT_PHONE || '+1-555-0123',
  },
};

// Email validation
export function validateEmailConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!emailConfig.smtp.auth.user) {
    errors.push('EMAIL_USER is required');
  }

  if (!emailConfig.smtp.auth.pass) {
    errors.push('EMAIL_PASSWORD is required');
  }

  if (!emailConfig.from.email) {
    errors.push('EMAIL_FROM is required');
  }

  if (!emailConfig.urls.baseUrl) {
    errors.push('NEXTAUTH_URL is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Get email configuration for different environments
export function getEmailConfig(environment: 'development' | 'production' | 'test') {
  const baseConfig = { ...emailConfig };

  switch (environment) {
    case 'development':
      return {
        ...baseConfig,
        queue: {
          ...baseConfig.queue,
          delayBetweenEmails: 500, // Faster for development
        },
      };

    case 'test':
      return {
        ...baseConfig,
        queue: {
          ...baseConfig.queue,
          maxRetries: 1,
          retryDelay: 1000,
          delayBetweenEmails: 100,
        },
      };

    case 'production':
      return {
        ...baseConfig,
        queue: {
          ...baseConfig.queue,
          maxRetries: 5,
          retryDelay: 10000, // Longer delays for production
          delayBetweenEmails: 2000, // More conservative rate limiting
        },
      };

    default:
      return baseConfig;
  }
} 