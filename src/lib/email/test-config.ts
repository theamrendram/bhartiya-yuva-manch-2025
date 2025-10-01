import dotenv from 'dotenv';
import { emailConfig, validateEmailConfig } from './config';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Test email configuration
function testEmailConfig() {
  console.log('=== Email Configuration Test ===');
  
  // Check if environment variables are loaded
  console.log('Environment Variables:');
  console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
  console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
  console.log('EMAIL_SECURE:', process.env.EMAIL_SECURE);
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
  console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'SET' : 'NOT SET');
  console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
  console.log('EMAIL_FROM_NAME:', process.env.EMAIL_FROM_NAME);
  
  console.log('\nEmail Config Object:');
  console.log('SMTP Service:', emailConfig.smtp.service);
  console.log('SMTP Host:', emailConfig.smtp.host);
  console.log('SMTP Port:', emailConfig.smtp.port);
  console.log('SMTP Secure:', emailConfig.smtp.secure);
  console.log('SMTP User:', emailConfig.smtp.auth.user ? 'SET' : 'NOT SET');
  console.log('SMTP Password:', emailConfig.smtp.auth.pass ? 'SET' : 'NOT SET');
  console.log('From Email:', emailConfig.from.email);
  console.log('From Name:', emailConfig.from.name);
  
  // Validate configuration
  console.log('\nConfiguration Validation:');
  const validation = validateEmailConfig();
  console.log('Is Valid:', validation.isValid);
  if (!validation.isValid) {
    console.log('Errors:', validation.errors);
  } else {
    console.log('✅ Email configuration is valid!');
  }
  
  return validation.isValid;
}

// Run the test
testEmailConfig(); 