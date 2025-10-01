import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, verifyEmailConfig } from '@/lib/email';
import { emailQueue, getQueueStatus } from '@/lib/email/queue';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { template, email, data, useQueue = false } = body;

    // Validate required fields
    if (!template || !email) {
      return NextResponse.json(
        { error: 'Template and email are required' },
        { status: 400 }
      );
    }

    // Verify email configuration first
    const configValid = await verifyEmailConfig();
    if (!configValid) {
      return NextResponse.json(
        { error: 'Email configuration is invalid' },
        { status: 500 }
      );
    }

    let result: boolean;
    let emailId: string | undefined;

    if (useQueue) {
      // Use queue system
      emailId = await emailQueue.addToQueue({
        to: email,
        subject: `Test Email - ${template}`,
        template,
        data: data || {},
      }, 'high');
      result = true;
    } else {
      // Send directly
      result = await sendEmail({
        to: email,
        subject: `Test Email - ${template}`,
        template,
        data: data || {},
      });
    }

    if (result) {
      const queueStatus = getQueueStatus();
      return NextResponse.json({
        success: true,
        message: useQueue ? 'Email queued successfully' : 'Email sent successfully',
        emailId,
        queueStatus,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email test error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return email configuration status (without sensitive data)
    const configValid = await verifyEmailConfig();
    const queueStatus = getQueueStatus();

    return NextResponse.json({
      configValid,
      queueStatus,
      availableTemplates: [
        'welcome',
        'registration-confirmation',
        'password-reset',
        'payment-confirmation',
        'admin-notification',
      ],
    });
  } catch (error) {
    console.error('Email status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 