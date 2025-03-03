import Filter from '@/components/shared/Filter';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import {  UserFilters } from '@/constants/filters';
//this commit is for testing contributions whether they are being counted or not

const page = () => {
  return (
    <>
            <h1 className="h1-bold text-dark100_light900">
              All Users
              </h1>
           

          <div className="mt-8 flex justify-between gap-5 max-sm:flex-col sm:items-center">
            <LocalSearchbar
              route="/community"
              iconPosition="left"
              imgSrc="/assets/icons/search.svg"
              placeholder="Search for amazing minds"
              otherClasses="flex-1"
            />
            <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]" containerClasses={''}            />
          </div>

          <section>
            
          </section>
      </>
  )
}

export default page
