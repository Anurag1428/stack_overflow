"use server"

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose"
import Tag from "@/database/tag.model";
import { CreateQuestionParams, DeleteQuestionParams, EditQuestionParams, GetQuestionByIdParams, GetQuestionsParams, QuestionVoteParams } from "./shared.types";
import User from "@/database/user.model";
import { log } from "console";
import { revalidatePath } from "next/cache";
import Interaction from "@/database/interaction.model";
import Answer from "@/database/answer.model";


export async function getQuestions(params: GetQuestionsParams) {
    try {
        connectToDatabase();

        const questions = await Question.find({})
        .populate({ path: 'tags', model: Tag})
        .populate({path: 'author', model: User})
        .sort({ createdAt: -1})

        return { questions };
    } catch (error) {
        console.log(error)
        throw error;
        
    }
}

export async function createQuestion(params: CreateQuestionParams) {
    try {
        connectToDatabase();

        const { title, content, tags, author, path} = params;

        //Create the question
        const question = await Question.create({
            title,
            content,
            author
        });

        const tagDocuments = [];

        // Create the tags or get them if they already exist
        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
                { name: {$regex: new RegExp('^${tag}$' , "i" ) } }, 
                { $setOnInsert: { name: tag}, $push: { questions: question._id}},
                {upsert: true, new : true}
            )

            tagDocuments.push(existingTag._id);
        }

        await Question.findByIdAndUpdate(question._id, {
            $push: { tags: { $each: tagDocuments }}
        });

        // Create an interaction record for the user's ask_question action

        // Increment author's reputation by +5 for creating a question

        revalidatePath(path)
    } catch (error) {
        
    }
}

export async function getQuestionById( params: GetQuestionByIdParams ) {
    try {
        connectToDatabase();

        const { questionId } = params;

        const question = await Question.findById(questionId)
        .populate({ path: 'tags', model: Tag, select: 'name _id' }) // ✅ Corrected
        .populate({ path: 'author', model: User, select: '_id clerkId name picture'})

        return question ;
        
    } catch (error) {
        console.log(error);
        throw error;
        
    }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
      try {
        connectToDatabase();

        const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

        let updateQuery = {};

        if (hasupVoted) {
            updateQuery = { $pull: { upvotes: userId }}
        } else if (hasdownVoted) {
            updateQuery = {
                $pull: { downvotes: userId },
                $push: { upvotes: userId }
            }
        } else {
            updateQuery = { $addToSet: { upvotes: userId }}
        }

        const question = await Question.findByIdAndUpdate(questionId, updateQuery, { new : true })

        if(!question) {
            throw new Error("Question not found")
        }

        // Increment author's reputation

        revalidatePath(path);

      } catch (error) {
        console.log(error);
        throw error;
      }
    }

export async function downvoteQuestion(params: QuestionVoteParams) {
        try {
          connectToDatabase();
  
          const { questionId, userId, hasupVoted, hasdownVoted, path } = params;
  
          let updateQuery = {};
  
          if (hasdownVoted) {
              updateQuery = { $pull: { downvote: userId }}
          } else if (hasupVoted) {
              updateQuery = {
                  $pull: { upvotes: userId },
                  $push: { downvotes: userId }
              }
          } else {
              updateQuery = { $addToSet: { downvotes: userId }}
          }
  
          const question = await Question.findByIdAndUpdate(questionId, updateQuery, { new : true })
  
          if(!question) {
              throw new Error("Question not found")
          }
  
          // Increment author's reputation
  
          revalidatePath(path);
  
        } catch (error) {
          console.log(error);
          throw error;
        }
    }

export async function deleteQuestion(params: DeleteQuestionParams) {
    try {
        connectToDatabase();

        const { questionId, path} = params;

        await Question.deleteOne({ _id: questionId});
        await Answer.deleteOne({ question: questionId});
        await Interaction.deleteMany({ question: questionId });
        await Tag.updateMany({ questions: questionId}, { $pull: { questions: questionId }})

        revalidatePath(path);
        
    } catch (error) {
        console.log(error);
    }
}

export async function editQuestion(params: EditQuestionParams) {
    try {
        connectToDatabase();

        const { questionId, title, content, path} = params;

        const question = await Question.findById(questionId).populate("tags");

        if(!question) {
            throw new Error("Question not found")
        }

        question.title = title;
        question.content = content;

        await question.save();


        revalidatePath(path);
        
    } catch (error) {
        console.log(error);
    }
}

export async function getHotQuestions() {
      try {
        connectToDatabase();

        const hotQuestions = await Question.find({})
        .sort({ views: -1, upvotes: -1})
        .limit(5)

        return hotQuestions

      } catch (error) {
        console.log(error);
        throw error;
      }
    }