import QuestionCard from '@/components/cards/QuestionCard';
import NoResult from '@/components/shared/NoResult';
import Pagination from '@/components/shared/Pagination';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { IQuestion } from '@/database/question.model';
import { getQuestionsByTagId } from '@/lib/actions/tag.actions';
import { URLProps } from '@/types';
import React from 'react'

const Page = async ({ params, searchParams}: any) => {
    const result = await getQuestionsByTagId({
        tagId: params.id,
        page: searchParams.page ? +searchParams.page : 1,
        searchQuery: Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q
    })

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>

      <div className="mt-11 w-full">
        <LocalSearchbar
          route={`/tags/${params.id}`}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search tag questions"
          otherClasses="flex-1"
        />
        
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => ( // ✅ FIXED (add correct type if you have one)
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author || { name: 'Unknown User', _id: 'unknown' }}
              upvotes={question.upvotes}
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

      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext= {result.isNext}
        />
      </div>
    </>
  )
}

export default Page;