import { createEmailWrapper } from '../templates';

export function finalNotificationTemplate(data: { 
  userName: string; 
  registrationData: any 
}): string {
  const content = `
    <h2>Final Notification - R10 IEEE Computer Society Summer School 2025 📧</h2>
    
    <p>Dear ${data.userName},</p>
    
    <div class="info-box">
      <h3>Important Update Regarding Your Registration</h3>
      <p>We hope this email finds you well. This is a final notification regarding your registration for the R10 IEEE Computer Society Summer School 2025.</p>
    </div>
    
    <div class="info-box">
      <h3>Registration Details</h3>
      <p><strong>Registration ID:</strong> ${data.registrationData.id || "N/A"}</p>
      <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Current Status:</strong> <span style="color: #ff6b35; font-weight: bold;">${data.registrationData.status || "Confirmed"}</span></p>
    </div>
    
    <div class="highlight">
      <h3>Program Information</h3>
      <p><strong>Event:</strong> R10 IEEE Computer Society Summer School 2025</p>
      <p><strong>Duration:</strong> 5-day intensive program</p>
      <p><strong>Topics Covered:</strong></p>
      <ul>
        <li>Introduction to Data Science for Decision-Making</li>
        <li>Machine Learning for Predictive Analytics</li>
        <li>Data Visualization for Storytelling</li>
        <li>Time Series Analysis and Forecasting</li>
        <li>Deep Learning for Classification and Regression</li>
        <li>Natural Language Processing for Text Analysis</li>
      </ul>
    </div>
    
    <div class="success-box">
      <h3>Expected Outcomes</h3>
      <ul>
        <li>Enhanced understanding of current and future research trends in Computer Science and IT</li>
        <li>Networking opportunities with peers and industry experts</li>
        <li>Development of collaborative research ideas among participants</li>
      </ul>
    </div>
    
    <div class="info-box">
      <h3>Important Notes</h3>
      <ul>
        <li>This is a focused learning experience - no course materials or orientation session</li>
        <li>Direct hands-on experience with cutting-edge technologies</li>
        <li>Certificate of participation upon completion</li>
        <li>Limited seats available for optimal learning experience</li>
      </ul>
    </div>
    
    <p><strong>If you have any questions or need assistance, please don't hesitate to contact our support team.</strong></p>
    
    <p>Thank you for your interest in our program.</p>
    
    <p>Best regards,<br>
    The R10 IEEE Computer Society Summer School 2025 Team</p>
  `;
  
  return createEmailWrapper(content, 'Final Notification - R10 IEEE Computer Society Summer School 2025');
} 