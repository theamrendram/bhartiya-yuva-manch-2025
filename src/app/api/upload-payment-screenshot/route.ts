import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/user.model";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  try {
    await dbConnect();
    const formData = await request.formData();
    const file = formData.get("paymentScreenshot");
    console.log(session?.user?.email, file);

    if (!session?.user?.email || typeof session?.user?.email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Payment screenshot file is required" }, { status: 400 });
    }

    // Upload to Cloudinary
    let paymentScreenshotUrl = "";
    try {
      paymentScreenshotUrl = await uploadToCloudinary(file);
    } catch (err) {
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }

    // Update user
    const user = await User.findOne({ email: session?.user?.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    user.paymentScreenshotUrl = paymentScreenshotUrl;
    await user.save();

    return NextResponse.json({ success: true, paymentScreenshotUrl });
  } catch (error) {
    console.error("Error uploading payment screenshot:", error);
    return NextResponse.json({ error: "Failed to upload payment screenshot" }, { status: 500 });
  }
} 