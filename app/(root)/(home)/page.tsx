export const dynamic = 'force-dynamic';


import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import { getQuestions, getRecommendedQuestions } from "@/lib/actions/question.action";
import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Home | Dev Overflow",
  description:
    "Dev Overflow is a community of 1,000,000+ developers where you can interact with other developers, ask questions, and share knowledge. Join us.",
};

// Helper function to safely extract string values
const getStringParam = (param?: string | string[]) => {
  return Array.isArray(param) ? param[0] : param;
};

// Skip TypeScript checking for the component props for now
// @ts-ignore
export default async function Home({ searchParams }) {
  const { userId } = await auth();

  const filter = getStringParam(searchParams.filter);
  const q = getStringParam(searchParams.q);
  const page = parseInt(getStringParam(searchParams.page) || "1");

  let result;

  if (filter === "recommended") {
    if (userId) {
      result = await getRecommendedQuestions({
        userId: userId as string,
        searchQuery: q,
        page,
      });
    } else {
      result = {
        questions: [],
        isNext: false,
      };
    }
  } else {
    result = await getQuestions({
      searchQuery: q,
      filter,
      page,
    });
  }

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-8 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author || {
                name: "Unknown User",
                _id: "unknown",
              }}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no question to show"
            description="Be the first to break the silence! Ask a Question and kickstart the discussion. Your question could help many others with similar queries."
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>

      <div className="mt-10">
        <Pagination pageNumber={page} isNext={result.isNext} />
      </div>
    </>
  );
}