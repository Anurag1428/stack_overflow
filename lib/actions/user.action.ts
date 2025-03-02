"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { CreateUserParams, DeleteUserParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export async function getUserById(params: any) {
  try {
    await connectToDatabase();
    
    const { userId } = params;
    
    const user = await User.findOne({ clerkId: userId });
    
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    await connectToDatabase();
    
    const newUser = await User.create(userData);
    
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    await connectToDatabase();
    
    const { clerkId, updateData, path } = params;
    
    const updatedUser = await User.findOneAndUpdate(
      { clerkId }, 
      updateData, 
      { new: true }
    );
    
    if (path) {
      revalidatePath(path);
    }
    
    return updatedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    await connectToDatabase();
    
    const { clerkId } = params;
    
    const user = await User.findOne({ clerkId });
    if (!user) {
      throw new Error('User not found');
    }
    
    // Delete user's questions
    const userQuestionIds = await Question.find({ author: user._id }).distinct('_id');
    await Question.deleteMany({ author: user._id });
    
    // TODO: delete user answers, comments, etc.
    
    const deletedUser = await User.findByIdAndDelete(user._id);
    
    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// New function to create or update user based on clerkId
export async function createOrUpdateUser(userData: CreateUserParams) {
  try {
    await connectToDatabase();
    
    const { clerkId } = userData;
    
    if (!clerkId) {
      return { 
        success: false, 
        message: "Clerk ID is required" 
      };
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
      
      return { 
        success: true, 
        user: updatedUser,
        isNewUser: false
      };
    } else {
      // Create new user with required fields
      const newUser = await User.create({
        ...userData,
        saved: [],
        joinedAt: new Date()
      });
      
      return { 
        success: true, 
        user: newUser,
        isNewUser: true
      };
    }
  } catch (error: any) {
    console.log("Error in createOrUpdateUser:", error);
    return { 
      success: false, 
      message: error.message || "Failed to create or update user" 
    };
  }
}