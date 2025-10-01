import { NextResponse } from "next/server";
import User from "@/models/user.model";
import dbConnect from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
    const session = await auth();
    console.log(session?.user?.email);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        await dbConnect();
        const user = await User.findOne({ email: session?.user?.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        console.log(user);
        return NextResponse.json(user);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}