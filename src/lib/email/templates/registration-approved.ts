import { createEmailWrapper } from "../templates";

export function registrationApprovedTemplate(data: {
  userName: string;
  registrationData: any;
  paymentAmount: number;
  schedulePdfLink: string;
  qrCodeImage: string;
  paymentLink: string;
}): string {
  const content = `
    <h2>Registration Approved & Payment Request - R10 IEEE Computer Society Summer School 2025 ✅💳</h2>
    
    <p>Dear ${data.userName},</p>
    
    <div class="success-box">
      <h3>Great News! Your registration has been approved! ✅</h3>
      <p>We're excited to confirm your participation in our 5-day intensive summer school program.</p>
    </div>
    
    <div class="info-box">
      <h3>Registration Details</h3>
      <p><strong>Registration ID:</strong> ${data.registrationData.id || "N/A"}</p>
      <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">Approved</span></p>
    </div>
    
    <div class="info-box">
      <h3>Payment Details</h3>
      <p><strong>Amount Due:</strong> <span style="font-size: 18px; font-weight: bold; color: #0066cc;">₹${data.paymentAmount}</span></p>
      <p><strong>Payment Deadline:</strong> Please complete payment within 48 hours to secure your spot.</p>
    </div>
    
    
    
    <div style="text-align: center; margin: 30px 0;">
      
      <div style="margin: 20px 0;">
        <h3>Kindly Scan QR code to pay:</h3>
        <img src="${data.qrCodeImage}" alt="Payment QR Code" style="max-width: 200px; border: 1px solid #ddd; border-radius: 8px; padding: 10px;">
      </div>
       <h4>
    Next Step: Kindly upload the payment screenshot on your profile page,
    <a href="https://summer-school.bvicam.in/profile" target="_blank" style="color: #0066cc; text-decoration: underline;">
      Profile Page
    </a>
  </h4>


    </div>
    
    <div class="info-box">
      <h3>What's Included</h3>
      <ul>
        <li>5-day intensive learning program</li>
        <li>Expert-led sessions on cutting-edge topics</li>
        <li>Networking opportunities with industry professionals</li>
        <li>Certificate of participation</li>
        <li>Access to session materials</li>
      </ul>
    </div>
    
    <div class="highlight">
      <h3>Important Reminders</h3>
      <ul>
        <li>Complete payment within 48 hours to secure your spot</li>
        <li>You'll receive a confirmation email after payment verification</li>
        <li>No course materials or orientation session - this is a focused learning experience</li>
      </ul>
    </div>
    
    <p>If you have any questions about your registration, payment, or need assistance, please contact our support team immediately.</p>
    
    <p>We look forward to having you join us for this exciting learning journey!</p>
    
    <p>Best regards,<br>
    The R10 IEEE Computer Society Summer School 2025 Team</p>
  `;

  return createEmailWrapper(
    content,
    "Registration Approved - R10 IEEE Computer Society Summer School 2025",
  );
}
