"use server"

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose"
import Tag from "@/database/tag.model";
import { CreateQuestionParams, DeleteQuestionParams, EditQuestionParams, GetQuestionByIdParams, GetQuestionsParams, QuestionVoteParams, RecommendedParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Interaction from "@/database/interaction.model";
import Answer from "@/database/answer.model";
import { FilterQuery } from "mongoose";
import { act } from "react";
import { skip } from "node:test";


export async function getQuestions(params: GetQuestionsParams) {
    try {
        connectToDatabase();

        const { searchQuery, filter, page = 1, pageSize = 10} = params;

        //Calculate the number of posts to skip based on the page number and page size
        const skipAmount = (page - 1) * pageSize;

        const query: FilterQuery<typeof Question> = {};

        if(searchQuery) {
            query.$or = [
                {title: { $regex: new RegExp(searchQuery, "i")}},
                {content: { $regex: new RegExp(searchQuery, "i")}},
            ]
        }

        let sortOptions = {};

        switch (filter) {
            case "newest":
                sortOptions = { createdAt: -1};
                break;
            case "frequent":
                sortOptions = { views: -1};
                break;

            case "unanswered":
                query.answers = { $size: 0};
                break;
            default:
                break;
        }

        const questions = await Question.find(query)
        .populate({ path: 'tags', model: Tag})
        .populate({path: 'author', model: User})
        .skip(skipAmount)
        .limit(pageSize)
        .sort(sortOptions)

        const totalQuestions = await Question.countDocuments(query);

        const isNext = totalQuestions > skipAmount + questions.length;

        return { questions, isNext };
    } catch (error) {
        console.log(error)
        throw error;
        
    }
}

// export async function createQuestion(params: CreateQuestionParams) {
//     try {
//         connectToDatabase();

//         const { title, content, tags, author, path} = params;

//         //Create the question
//         const question = await Question.create({
//             title,
//             content,
//             author
//         });

//         const tagDocuments = [];

//         // Create the tags or get them if they already exist
//         for (const tag of tags) {
//             const existingTag = await Tag.findOneAndUpdate(
//                 { name: {$regex: new RegExp('^${tag}$' , "i" ) } }, 
//                 { $setOnInsert: { name: tag}, $push: { questions: question._id}},
//                 {upsert: true, new : true}
//             )

//             tagDocuments.push(existingTag._id);
//         }

//         await Question.findByIdAndUpdate(question._id, {
//             $push: { tags: { $each: tagDocuments }}
//         });

//         // Create an interaction record for the user's ask_question action

//         // Increment author's reputation by +5 for creating a question

//         revalidatePath(path)
//     } catch (error) {
        
//     }
// }

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
                { name: { $regex: new RegExp(`^${tag}$`, "i") } }, 
                { 
                    $setOnInsert: { name: tag.toUpperCase() }, 
                    $push: { questions: question._id }
                },
                { upsert: true, new: true }
            )

            tagDocuments.push(existingTag._id);
        }

        await Question.findByIdAndUpdate(question._id, {
            $push: { tags: { $each: tagDocuments }}
        });

        // Create an interaction record for the user's ask_question action
        await Interaction.create({
            user: author,
            action: "ask_question",
            question: question._id,
            tags: tagDocuments,
        })
        // Increment author's reputation by +5 for creating a question
        await User.findByIdAndUpdate(author, { $inc: { reputation: 5 }});

        revalidatePath(path);
        return question;
    } catch (error) {
        console.error('Error creating question:', error);
        throw error;
    }
}

export async function getQuestionById( params: GetQuestionByIdParams ) {
    try {
        connectToDatabase();

        const { questionId } = params;

        // const question = await Question.findById(questionId)
        // .populate({ path: 'tags', model: Tag, select: 'name _id' }) // ✅ Corrected
        // .populate({ path: 'author', model: User, select: '_id clerkId name picture'})

        const question = await Question.findById(questionId)
    .populate({ path: 'tags', model: Tag, select: 'name _id' })
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

        // Increment author's reputation by +1/-1 for upvoting/revoking an upvote to the question
        await User.findByIdAndUpdate(userId, {
            $inc: { reputation: hasupVoted ? -1 : 1 }
        })

        // Increment author's reputation by +10/-10 for receiving an upvote/downvote to the question
        await User.findByIdAndUpdate(question.author, {
            $inc: { reputation: hasupVoted ? -10 : 10 }
        })


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
            await User.findByIdAndUpdate(userId, { 
                $inc: { reputation: hasupVoted ? -2 : 2 }
            });

            await User.findByIdAndUpdate(question.author, { 
                $inc: { reputation: hasupVoted ? -10 : 10 }
            });

            // pr doesn't showed for implementing reputation for answers.

  
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

export async function getRecommendedQuestions(params: 
    RecommendedParams) {
        try{
            await connectToDatabase()

            const { userId, page=1, pageSize=20, searchQuery} = params;

            //find user
            const user = await User.findOne({ clerkId: userId});

            if(!user) {
                throw new Error("User not found")
            }

            const skipAmount = (page - 1) * pageSize;

            //Find the user's Interactions
            const userInteractions = await Interaction.find({ user: user._id })
            .populate("tags")
            .exec();

            //Extract tags from user interactions
            const userTags = userInteractions.reduce((tags, interaction) => {
                if(interaction.tags) {
                    tags = tags.concat(interaction.tags);
                }
                return tags;
            }, []);

            // Get distinct tag IDs from user's interactions
            const distinctUserTagIds = [
                ...new Set(userTags.map((tag: any) => tag._id)),
            ];

            const query: FilterQuery<typeof Question> = {
                $and: [
                    { tags: { $in: distinctUserTagIds }},
                    { author: { $ne: user._id }},
                ],
            };

            if(searchQuery) {
                query.$or = [
                    {title: { $regex: searchQuery, $options: "i"}},
                    {content: { $regex: searchQuery, $options: "i"}},
                ];
            }

            const totalQuestions = await Question.countDocuments(query);

            const recommendedQuestions = await Question.find(query)
            .populate({
                path: "tags",
                model: Tag,
            })
            .populate({
                path: "author",
                model: User,
            })
            .skip(skipAmount)
            .limit(pageSize)

            const isNext = totalQuestions > skipAmount + recommendedQuestions.length;

            return { questions: recommendedQuestions, isNext };
        } catch(error) {
            console.error("Error fetching recommended questions:", error);
            throw error;
        }
    }