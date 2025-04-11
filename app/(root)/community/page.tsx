export const dynamic = 'force-dynamic'; // 👈 Add this to fix useSearchParams crash

import { Suspense } from 'react';
import UserCard from '@/components/cards/UserCard';
import Filter from '@/components/shared/Filter';
import Pagination from '@/components/shared/Pagination';
import { UserFilters } from '@/constants/filters';
import { getAllUsers } from '@/lib/actions/user.action';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';

const Page = async ({ searchParams }: any) => {
  const result = await getAllUsers({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-8 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Suspense fallback={<div>Loading search bar...</div>}>
          <LocalSearchbar
            route="/community"
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Search for amazing minds"
            otherClasses="flex-1"
          />
        </Suspense>

        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses=""
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {result.users.length > 0 ? (
          result.users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>No users yet</p>
            <a href="/sign-up" className="mt-2 font-bold text-accent-blue">
              Join to be the first!
            </a>
          </div>
        )}
      </section>

      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default Page;
