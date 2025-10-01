import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import dbConnect from "@/lib/db";
import { auth } from "@/auth";
import { queueRegistrationApproved } from "@/lib/email/queue";

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

        const {
            userId,
            paymentAmount: customPaymentAmount,
            schedulePdfLink: customSchedulePdfLink,
            qrCodeImage: customQrCodeImage,
            paymentLink: customPaymentLink
        } = await request.json();

        // Use provided values or defaults
        const qrCodeImage = customQrCodeImage || "https://res.cloudinary.com/djmdoyahp/image/upload/v1750754977/importants/PHOTO-2025-01-08-11-26-45_iv3pqv.jpg";
        const schedulePdfLink = customSchedulePdfLink || "https://res.cloudinary.com/djmdoyahp/image/upload/v1750754977/importants/PHOTO-2025-01-08-11-26-45_iv3pqv.jpg";
        const paymentLink = customPaymentLink || `https://ieeesummerschool.com/pay/${userId || 'unknown'}`; // Placeholder, replace with real logic if needed

        if (!userId) {
            console.error("User ID is required");
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        if (!schedulePdfLink || !qrCodeImage || !paymentLink) {
            console.error("Missing one or more required fields: schedulePdfLink, qrCodeImage, paymentLink");
            return NextResponse.json({
                error: "Schedule PDF link, QR code image, and payment link are required"
            }, { status: 400 });
        }

        // Find the user
        let user;
        try {
            user = await User.findById(userId);
        } catch (findErr) {
            console.error("Database error while finding user:", findErr);
            return NextResponse.json({ error: "Database error while finding user" }, { status: 500 });
        }
        if (!user) {
            console.error(`User not found for ID: ${userId}`);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if user is already paid
        if (user.isPaid) {
            console.warn(`User ${user.email} has already paid.`);
            return NextResponse.json({ error: "User has already paid" }, { status: 400 });
        }

        // Use provided paymentAmount or calculate default
        const paymentAmount = customPaymentAmount !== undefined ? parseFloat(customPaymentAmount) : (user.isIeeeCSMember ? 1700 : 1700);

        // Send registration approved email with payment request
        try {
            await queueRegistrationApproved(user.email, user.fullName, {
                registrationData: {
                    id: user._id,
                    status: 'Approved',
                    registrationDate: user.createdAt
                },
                paymentAmount: paymentAmount,
                schedulePdfLink: schedulePdfLink,
                qrCodeImage: qrCodeImage,
                paymentLink: paymentLink
            });

            // Update user status to indicate registration approved and payment request sent
            user.paymentRequestSent = true;
            user.paymentRequestSentAt = new Date();
            user.isVerified = true; // Mark as verified since approved
            user.updatedAt = new Date();
            await user.save();

            console.log(`Registration approved email with payment request queued for ${user.email}`);
        } catch (emailError) {
            console.error("Failed to send registration approved email:", emailError);
            return NextResponse.json({ error: "Failed to send registration approved email" }, { status: 500 });
        }

        return NextResponse.json({
            message: "Registration approved and payment request sent successfully",
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                isVerified: user.isVerified,
                paymentRequestSent: user.paymentRequestSent,
                paymentRequestSentAt: user.paymentRequestSentAt
            }
        });
    } catch (error) {
        console.error("Error sending registration approved email:", error);
        return NextResponse.json({ error: "Failed to send registration approved email" }, { status: 500 });
    }
} 

// This endpoint merges the logic of registration approval and payment link sending.
// It accepts optional payment info and can be used for both admin approval and payment requests. 