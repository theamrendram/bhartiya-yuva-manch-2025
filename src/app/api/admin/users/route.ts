import { NextResponse } from "next/server";
import User from "@/models/user.model";
import dbConnect from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
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

        // Fetch all users except deleted ones
        const users = await User.find({ isDeleted: false })
            .select('-password') // Exclude password field
            .sort({ createdAt: -1 }); // Sort by creation date, newest first

        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
} 