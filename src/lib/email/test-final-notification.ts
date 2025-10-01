import { renderTemplate } from './templates';

// Test the final notification template
async function testFinalNotificationTemplate() {
  try {
    // Test for verified user (payment pending)
    const testDataVerified = {
      userName: 'John Doe',
      registrationData: {
        id: 'TEST123',
        status: 'Payment Pending',
        registrationDate: new Date().toISOString()
      }
    };

    const htmlContentVerified = await renderTemplate('final-notification', testDataVerified);
    
    console.log('Final notification template (verified user) rendered successfully!');
    console.log('Template length:', htmlContentVerified.length);
    console.log('Status in template:', testDataVerified.registrationData.status);

    // Test for unverified user (confirmed)
    const testDataUnverified = {
      userName: 'Jane Smith',
      registrationData: {
        id: 'TEST456',
        status: 'Confirmed',
        registrationDate: new Date().toISOString()
      }
    };

    const htmlContentUnverified = await renderTemplate('final-notification', testDataUnverified);
    
    console.log('Final notification template (unverified user) rendered successfully!');
    console.log('Template length:', htmlContentUnverified.length);
    console.log('Status in template:', testDataUnverified.registrationData.status);
    
    return true;
  } catch (error) {
    console.error('Error testing final notification template:', error);
    return false;
  }
}

// Run the test
testFinalNotificationTemplate(); 