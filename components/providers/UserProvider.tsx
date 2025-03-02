"use client";

import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded: isAuthLoaded, userId, isSignedIn } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    // Only proceed when Clerk auth and user are loaded
    if (!isAuthLoaded || !isUserLoaded) return;
    
    const syncUser = async () => {
      if (!isSignedIn || !userId || !user) return;
      
      try {
        // Extract user data from Clerk
        const userData = {
          clerkId: userId,
          name: `${user.firstName} ${user.lastName || ""}`.trim(),
          username: user.username || `user_${Date.now().toString().slice(-5)}`,
          email: user.primaryEmailAddress?.emailAddress || "",
          picture: user.imageUrl,
          // Optional fields
          bio: (user.publicMetadata?.bio as string) || "",
          location: (user.publicMetadata?.location as string) || "",
          portfolioWebsite: (user.publicMetadata?.portfolioWebsite as string) || ""
        };
        
        const response = await fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
        
        const data = await response.json();
        
        if (data.success) {
          if (data.isNewUser) {
            toast.success("Welcome! Your account has been created.");
          } else {
            toast.success("Your profile has been updated successfully!");
          }
          
          // Force a refresh to update the UI with the latest user data
          router.refresh();
        } else {
          toast.error(data.message || "Something went wrong");
        }
      } catch (error) {
        console.error("Error syncing user:", error);
        toast.error("Failed to update user information");
      }
    };
    
    syncUser();
  }, [isAuthLoaded, isUserLoaded, isSignedIn, userId, user, router]);
  
  return children;
}