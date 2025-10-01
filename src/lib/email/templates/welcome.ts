import { createEmailWrapper } from "../templates";

export function welcomeTemplate(data: { userName: string }): string {
  const content = `
    <h2>Welcome to R10 IEEE Computer Society Summer School 2025, ${data.userName}! 🎉</h2>
    
    <p>Thank you for registering for our 5-day intensive summer school program!</p>
    
    <div class="info-box">
      <h3>What You'll Learn</h3>
      <ul>
        <li>Introduction to Data Science for Decision-Making</li>
        <li>Machine Learning for Predictive Analytics</li>
        <li>Data Visualization for Storytelling</li>
        <li>Time Series Analysis and Forecasting</li>
        <li>Deep Learning for Classification and Regression</li>
        <li>Natural Language Processing for Text Analysis</li>
      </ul>
    </div>
    
    <div class="highlight">
      <h3>Next Steps</h3>
      <p>Your registration has been received and is currently under review. Here's what happens next:</p>
      <ol>
        <li><strong>Document Review:</strong> Our team will review your registration details</li>
        <li><strong>Payment Link:</strong> Once approved, you'll receive an email with payment QR code</li>
        <li><strong>Upload:</strong> Once paid, Kindly upload the screenshot on your profile page: 
        <a href="https://summer-school.bvicam.in/profile" target="_blank" style="color: #0066cc; text-decoration: underline;">
      Profile Page
    </a>
         </li>
        <li><strong>Confirmation:</strong> After payment confirmation, you'll be all set!</li>
      </ol>
    </div>
    
    <div class="success-box">
      <h3>Expected Outcomes</h3>
      <ul>
        <li>Enhanced understanding of current and future research trends in Computer Science and IT</li>
        <li>Networking opportunities with peers and industry experts</li>
        <li>Development of collaborative research ideas among participants</li>
      </ul>
    </div>
    
    <p>Please wait for our review process to complete. You'll receive a payment email with all the necessary details once your registration is approved.</p>
    
    <p>If you have any questions, don't hesitate to reach out to our support team.</p>
    
    <p>Best regards,<br>
    The R10 IEEE Computer Society Summer School 2025 Team</p>
  `;

  return createEmailWrapper(
    content,
    "Welcome to R10 IEEE Computer Society Summer School 2025",
  );
}
