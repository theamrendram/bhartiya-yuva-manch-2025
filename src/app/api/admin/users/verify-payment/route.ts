import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import dbConnect from "@/lib/db";
import { auth } from "@/auth";
import { queuePaymentConfirmation } from "@/lib/email/queue";

export async function POST(request: NextRequest) {
    const session = await auth();
    
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        
        // Check if the current user is an admin
        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser || currentUser.role !== "admin") {
            return NextResponse.json({ error: "Access denied. Admin role required." }, { status: 403 });
        }

        const { userId } = await request.json();
        
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Find and update the user
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Update payment verification status
        user.isPaymentVerified = true;
        user.isPaid = true;
        user.updatedAt = new Date();
        await user.save();
        // Use the same logic as approve-registration for payment details
        const qrCodeImage = "https://res.cloudinary.com/djmdoyahp/image/upload/v1750754977/importants/PHOTO-2025-01-08-11-26-45_iv3pqv.jpg";
        const schedulePdfLink = "https://res.cloudinary.com/djmdoyahp/image/upload/v1750754977/importants/PHOTO-2025-01-08-11-26-45_iv3pqv.jpg";
        const paymentLink = `https://ieeesummerschool.com/pay/${userId || 'unknown'}`;  
        const paymentAmount = user.isIeeeCSMember ? 1700 : 2000;

        // Send payment confirmation email
        try {
            await queuePaymentConfirmation(user.email, user.fullName, {
                transactionId: `PAY-${user._id}-${Date.now()}`,
                amount: paymentAmount,
                method: 'Admin Verification',
                paymentDate: new Date().toISOString(),
                status: 'Completed',
                verifiedBy: currentUser.fullName,
                schedulePdfLink,
                qrCodeImage,
                paymentLink
            });
            console.log(`Payment confirmation email queued for ${user.email}`);
        } catch (emailError) {
            console.error("Failed to send payment confirmation email:", emailError);
            // Don't fail the verification if email fails
        }

        return NextResponse.json({ 
            message: "Payment verified successfully",
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                isPaymentVerified: user.isPaymentVerified,
                isPaid: user.isPaid
            }
        });
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
    }
} 