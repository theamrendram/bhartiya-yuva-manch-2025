import { createEmailWrapper } from '../templates';

export function adminNotificationTemplate(data: { 
  notificationType: string; 
  data: any 
}): string {
  const content = `
    <h2>Admin Notification: ${data.notificationType} 📢</h2>
    
    <p>This is an automated notification for the R10 IEEE Computer Society Summer School 2025 administration team.</p>
    
    <div class="info-box">
      <h3>Notification Details</h3>
      <p><strong>Type:</strong> ${data.notificationType}</p>
      <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Priority:</strong> ${data.data.priority || 'Normal'}</p>
    </div>
    
    <div class="highlight">
      <h3>Notification Data</h3>
      <pre style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; overflow-x: auto;">
${JSON.stringify(data.data, null, 2)}
      </pre>
    </div>
    
    <p><strong>Action Required:</strong></p>
    <ul>
      <li>Review the notification details above</li>
      <li>Take appropriate action if necessary</li>
      <li>Update the system status if needed</li>
      <li>Contact the user if required</li>
    </ul>
    
    <p>This is an automated message. Please do not reply to this email.</p>
    
    <p>Best regards,<br>
    R10 IEEE Computer Society Summer School 2025 System</p>
  `;
  
  return createEmailWrapper(content, `Admin Notification: ${data.notificationType}`);
} 