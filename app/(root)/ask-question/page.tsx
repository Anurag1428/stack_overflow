import Question from '@/components/forms/Question';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async () => {
  const { userId } = await auth();

  // const userId = '123456789';

  if(!userId) redirect('/sign-in');

  console.log("Fetching user with ID:", userId);


  const mongoUser = await getUserById({userId});

  console.log(mongoUser);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">
        Ask a Question
      </h1>
      
      <div className="mt-9">
        <Question mongoUserId={JSON.stringify(mongoUser?._id)}/>
      </div>
    </div>
  )
}

export default Page;