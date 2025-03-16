import React from 'react'
import { SearchParamsProps } from '@/types';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
  searchParams: { [key: string]: string | undefined };
}

const AnswersTab = async ({  userId, clerkId}: Props) => {
  return (
    <div>
        AnswersTab
    </div>
  )
}

export default AnswersTab;
