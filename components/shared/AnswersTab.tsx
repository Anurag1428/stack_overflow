import React from 'react';
import { SearchParamsProps } from '@/types';
import { getUserAnswers } from '@/lib/actions/user.action';
import AnswerCard from '../cards/AnswerCard';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
  searchParams: { [key: string]: string | undefined };
}

const AnswersTab = async ({ userId, clerkId }: Props) => {
  const result = await getUserAnswers({
    userId,
    page: 1,
  });

  return (
    <>
      {result.answers
        .filter((item) => item.question !== null)
        .map((item) => (
          <AnswerCard
            key={item._id}
            clerkId={clerkId ?? undefined}
            _id={item._id}
            title={item.question.title}
            question={item.question}
            author={item.author}
            upvotes={item.upvotes}
            createdAt={item.createdAt}
          />
        ))}
    </>
  );
};

export default AnswersTab;
