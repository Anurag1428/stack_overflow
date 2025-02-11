import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";

const questions = [
  {
    _id: "1", // Changed to string
    title: "Cascading Deletes in SQLAlchemy?",
    tags: [
      { _id: "1", name: "python" },
      { _id: "2", name: "sql" }
    ],
    author: {
      _id: "101",
      name: "John Doe",
      picture: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    upvotes: 10,
    views: 100,
    answers: [], // Changed to an array of objects (empty for now)
    createdAt: new Date("2022-02-10T10:00:00Z") // Changed to Date
  },
  {
    _id: "2", // Changed to string
    title: "How to center a div?",
    tags: [
      { _id: "3", name: "css" },
      { _id: "4", name: "html" } // Fixed tag to be more relevant
    ],
    author: {
      _id: "102",
      name: "Jane Smith",
      picture: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    upvotes: 15,
    views: 250,
    answers: [], // Changed to an array of objects
    createdAt: new Date("2024-02-11T12:30:00Z") // Changed to Date
  }
];

export default function Home() {
return (
  <>
    <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
      <h1 className="h1-bold text-dark100_light900">All Questions</h1>

      <Link  href="/ask-question" className="flex justify-end max-sm:w-full">
        <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
          Ask a Question
        </Button>

      </Link>
    </div>

    <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
      <LocalSearchbar
        route="/"
        iconPosition="right"
        imgSrc="/assets/icons/search.svg"
        placeholder="Search for questions"
        otherClasses="flex-1"
      /> 

      <Filter
        filters={HomePageFilters}
        otherClasses="min-h-[56px sm:min-w-[170px]"
        containerClasses="hidden max-md:flex"
      />
    </div>

    <HomeFilters/>

    <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ?
        questions.map((question) => (
          <QuestionCard
            key={question._id}
            _id={question._id}
            title={question.title}
            tags={question.tags}
            author={question.author}
            upvotes={question.upvotes}
            views={question.upvotes}
            answers={question.answers}
            createdAt={question.createdAt}
          />
        ))
        : <NoResult
          title="There's no question to show"
          description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion
            our query could be the next big thing others learn from. Get involved!"
          link="/ask-question"
          linkTitle="Ask a question"
        />}
    </div>
  </>
)
}
