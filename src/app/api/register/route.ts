import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcrypt";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { queueWelcomeEmail } from "@/lib/email/queue";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const formData = await request.formData();
    const requiredFields = [
      "fullName",
      "email",
      "password",
      "gender",
      "phone",
      "isIeeeCSMember",
      "ieeeMemberId"
    ];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    const {
      idCard,
      cv,
      fullName,
      email,
      password,
      phone,
      gender,
      designation,
      ieeeMemberId,
      institutionCompany,
    } = Object.fromEntries(formData) as Record<string, string | File>;

    // Convert isIeeeCSMember from string to boolean
    const isIeeeCSMember = formData.get("isIeeeCSMember") === "true";

    // Parallelize file uploads
    const [ieeeIdCardUrl, cvUrl] = await Promise.all([
      idCard ? uploadToCloudinary(idCard as File) : Promise.resolve(""),
      cv ? uploadToCloudinary(cv as File) : Promise.resolve("")
    ]);
    const hashedPassword = await bcrypt.hash(password as string, 10);

    const user = await User.findOne({ email });
    const defaultValues = {
      isVerified: false,
      isPaid: false,
      isDeleted: false,
      role: "attendee",
      isPaymentVerified: false,
      isPaymentLinkSent: false,
      createdAt: new Date(),
    };
    
    let isNewUser = false;
    
    if (user) {
      Object.assign(user, {
        fullName,
        phone,
        gender,
        designation,
        isIeeeCSMember,
        ieeeMemberId,
        ieeeIdCardUrl,
        institutionCompany,
        cvUrl,
        password: hashedPassword,
        ...defaultValues,
      });
      await user.save();
    } else {
      const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
        phone,
        gender,
        designation,
        isIeeeCSMember,
        ieeeMemberId,
        ieeeIdCardUrl,
        institutionCompany,
        cvUrl,
        ...defaultValues,
      });
      await newUser.save();
      isNewUser = true;
    }

    // Respond to client as soon as user is created/updated and email is queued
    let emailSent = false;
    queueWelcomeEmail(email as string, fullName as string)
      .then(() => {
        console.log(`Welcome email queued for: ${email}`);
        emailSent = true;
      })
      .catch((emailError) => {
        console.error("Failed to send welcome email:", emailError);
      });

    // TODO: For even better performance, consider moving file uploads to the client side and only sending URLs to the backend.

    return NextResponse.json(
      { 
        message: "Registration successful",
        isNewUser,
        emailSent: true // Always true for now, since we queue asynchronously
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}