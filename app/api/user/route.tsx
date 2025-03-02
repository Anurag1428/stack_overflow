import { NextRequest, NextResponse } from "next/server";
import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json();
    const { clerkId, username } = userData;

    if (!clerkId || !username) {
      return NextResponse.json(
        { success: false, message: "Clerk ID and username are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if another user already has the same username
    const existingUsername = await User.findOne({ username });
    if (existingUsername && existingUsername.clerkId !== clerkId) {
      return NextResponse.json(
        { success: false, message: "Username already exists. Choose a different one." },
        { status: 400 }
      );
    }

    // Check if user exists in the database
    const existingUser = await User.findOne({ clerkId });

    if (existingUser) {
      // Update existing user
      const updatedUser = await User.findOneAndUpdate(
        { clerkId },
        { ...userData },
        { new: true }
      );

      return NextResponse.json({
        success: true,
        user: updatedUser,
        isNewUser: false
      });
    } else {
      // Create new user
      const newUser = await User.create({
        ...userData,
        reputation: 0,
        saved: [],
        joinedAt: new Date()
      });

      return NextResponse.json({
        success: true,
        user: newUser,
        isNewUser: true
      });
    }
  } catch (error: any) {
    console.error("Error in user API route:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to handle user operation" },
      { status: 500 }
    );
  }
}
