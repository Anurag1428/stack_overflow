import QuestionCard from '@/components/cards/QuestionCard';
import NoResult from '@/components/shared/NoResult';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { IQuestion } from '@/database/question.model';
import { getQuestionsByTagId } from '@/lib/actions/tag.actions';
import { URLProps } from '@/types';
import React from 'react';

const Page = async ({ params, searchParams }: URLProps) => {
  const result = await getQuestionsByTagId({
    tagId: params.id,
    page: 1,
    searchQuery: typeof searchParams.q === 'string' ? searchParams.q : '',
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>

      <div className="mt-11 w-full">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search tag questions"
          otherClasses="flex-1"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question: IQuestion) => (
            <QuestionCard
              key={question._id as string}
              _id={question._id as unknown as string}
              title={question.title}
              tags={question.tags.map((tag) => ({
                _id: tag.toString(),
                name: 'Tag Name',
              }))}
              author={
                typeof question.author === 'object' && !Array.isArray(question.author)
                  ? question.author
                  : {
                      name: 'Unknown User',
                      _id: 'unknown',
                      picture: '/path/to/default/picture.png',
                    }
              }
              upvotes={question.upvotes.map((upvote) => upvote.toString())}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no tag questions saved to show"
            description="Be the first to break the silence! Ask a Question and kickstart the discussion. Your question could help many others with similar queries."
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default Page;
