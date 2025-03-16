import { formatBigNumber, getTimestamp } from "@/lib/utils";
import Link from "next/link";
import Metric from "../shared/Metric";

interface Props {
  _id: string;
  title: string;
  question: {
    _id: string;
  };
  tags?: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  upvotes: string[];
  views?: number;
  answers?: Array<object>;
  createdAt: Date;
  clerkId?: string;
}

const AnswerCard = ({
  clerkId,
  _id,
  question,
  title,
  author,
  upvotes = [],
  createdAt,
}: Props) => {
  const createdAtTimestamp = getTimestamp(createdAt);

  return (
    <div className="card-wrapper rounded-[10px] px-11 py-9">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {createdAtTimestamp}
          </span>
          {/* ✅ Only wrap the title with Link */}
          <Link href={`/question/${question?._id}/#${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1 hover:underline">
              {title}
            </h3>
          </Link>
        </div>
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="user avatar"
          value={author.name}
          title={` - asked ${createdAtTimestamp}`}
          href={`/profile/${author._id}`}
          textStyles="body-medium text-dark400_light700"
          isAuthor
        />

        <div className="flex-center gap-3">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="like icon"
            value={formatBigNumber(upvotes.length)}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
