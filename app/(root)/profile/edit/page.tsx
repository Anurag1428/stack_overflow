export const dynamic = 'force-dynamic'; // ✅ Fixes useSearchParams crash during build


import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { getQuestionById } from '@/lib/actions/question.action';
import { getUserById } from '@/lib/actions/user.action';
import Profile from '@/components/forms/Profile';

const Page = async ({ params }: any) => {
  const { userId } = await auth();
  if (!userId) return null;

  const mongoUser = await getUserById({ userId });
  const result = await getQuestionById({ questionId: params.id });

  const serializedUser = JSON.stringify(mongoUser, (key, value) => {
    if (key === '_id' && value && typeof value.toString === 'function') {
      return value.toString();
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <Suspense fallback={<div>Loading profile...</div>}>
          <Profile clerkId={userId} user={serializedUser} />
        </Suspense>
      </div>
    </>
  );
};

export default Page;
