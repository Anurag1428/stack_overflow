import React from 'react';
import { SearchParamsProps } from '@/types';
import { getUserAnswers } from '@/lib/actions/user.action';
import AnswerCard from '../cards/AnswerCard';
import Pagination from './Pagination';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
  searchParams: { [key: string]: string | undefined };
}

const AnswersTab = async ({searchParams, userId, clerkId }: Props) => {
  const result = await getUserAnswers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
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

        <div className="mt-10">
          <Pagination
            pageNumber={searchParams?.page ? +searchParams.page : 1}
            isNext= {result.isNextAnswer}
          />
        </div>
    </>
  );
};

export default AnswersTab;
