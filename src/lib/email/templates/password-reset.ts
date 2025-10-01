import { createEmailWrapper } from '../templates';

export function passwordResetTemplate(data: { 
  userName: string; 
  resetUrl: string 
}): string {
  const content = `
    <h2>Password Reset Request 🔐</h2>
    
    <p>Dear ${data.userName},</p>
    
    <p>We received a request to reset your password for your R10 IEEE Computer Society Summer School 2025 account.</p>
    
    <div class="info-box">
      <h3>Reset Your Password</h3>
      <p>Click the button below to create a new password. This link will expire in 1 hour for security reasons.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.resetUrl}" class="button" style="background-color: #dc3545;">
          Reset Password
        </a>
      </div>
      
      <p><strong>Or copy this link:</strong><br>
      <a href="${data.resetUrl}" style="word-break: break-all;">${data.resetUrl}</a></p>
    </div>
    
    <div class="highlight">
      <h3>Security Notice</h3>
      <ul>
        <li>This link will expire in 1 hour</li>
        <li>If you didn't request this reset, please ignore this email</li>
        <li>Your current password will remain unchanged until you complete the reset</li>
        <li>For security, this link can only be used once</li>
      </ul>
    </div>
    
    <p>If you're having trouble clicking the button, copy and paste the URL above into your web browser.</p>
    
    <p>If you didn't request a password reset, please contact our support team immediately.</p>
    
    <p>Best regards,<br>
    The R10 IEEE Computer Society Summer School 2025 Team</p>
  `;
  
  return createEmailWrapper(content, 'Password Reset Request - R10 IEEE Computer Society Summer School 2025');
} 