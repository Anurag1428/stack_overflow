import { Schema, model, models, Document} from 'mongoose';
import Question from './question.model';

export interface IInteraction extends Document {
    user: Schema.Types.ObjectId; // reference to the user
    action: string;
    question: Schema.Types.ObjectId; // reference to question
    answer: Schema.Types.ObjectId; // reference to answer
    tags: Schema.Types.ObjectId[]; // reference to tag
    createdAt: Date;
}

const InteractionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true},
    Question: { type: Schema.Types.ObjectId, ref: 'Question'},
    answer: { type: Schema.Types.ObjectId, ref: 'Answer'}, 
    tags: { type: Schema.Types.ObjectId, ref: 'Tag'},
    createdAt: { type: Date, default: Date.now },
});

const Interaction = models.Interaction || model('Interaction', InteractionSchema);

export default Interaction;