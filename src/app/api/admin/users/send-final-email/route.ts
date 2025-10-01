import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import dbConnect from "@/lib/db";
import { auth } from "@/auth";
import { queueFinalNotification } from "@/lib/email/queue";

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

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Send final notification email
        try {
            await queueFinalNotification(user.email, user.fullName, {
                id: user._id,
                status: user.isVerified ? 'Payment Pending' : 'Confirmed',
                registrationDate: user.createdAt
            });

            // Update user status to indicate final email sent
            user.finalEmailSent = true;
            user.finalEmailSentAt = new Date();
            user.updatedAt = new Date();
            await user.save();

            console.log(`Final notification email queued for ${user.email}`);
        } catch (emailError) {
            console.error("Failed to send final notification email:", emailError);
            return NextResponse.json({ error: "Failed to send final notification email" }, { status: 500 });
        }

        return NextResponse.json({ 
            message: "Final notification email sent successfully",
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                finalEmailSent: user.finalEmailSent,
                finalEmailSentAt: user.finalEmailSentAt
            }
        });
    } catch (error) {
        console.error("Error sending final notification email:", error);
        return NextResponse.json({ error: "Failed to send final notification email" }, { status: 500 });
    }
} 