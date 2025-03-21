import Profile from '@/components/forms/Profile';
import { getQuestionById } from '@/lib/actions/question.action';
import { getUserById } from '@/lib/actions/user.action';
import { ParamsProps } from '@/types';
import { auth } from '@clerk/nextjs/server';
import React from 'react'
 
const Page = async ({ params} : ParamsProps) => {
  const { userId } = await auth();

  if(!userId) return null;

  const mongoUser = await getUserById({ userId });
  const result = await getQuestionById({ questionId: params.id });

  // Serialize the mongoUser object using a safer approach
  // This handles MongoDB ObjectId and other non-serializable objects
  const serializedUser = JSON.stringify(
    mongoUser,
    (key, value) => {
      // Convert ObjectId to string (if that's what's causing issues)
      if (key === '_id' && value && typeof value.toString === 'function') {
        return value.toString();
      }
      // Convert Date objects to ISO strings
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }
  );

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">
        Edit Profile
      </h1>

      <div className="mt-9">
        <Profile
          clerkId={userId}
          // user={serializedUser}
          user={JSON.stringify(mongoUser)}
        />
      </div>
    </>
  )
}
 
export default Page;