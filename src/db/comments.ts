import {Schema, model, Document, Mongoose} from 'mongoose';
import { BaseTime, PreSaveAddingTimeStamp } from './base';
import {TaskModel} from './tasks'
import * as bcrypt from 'bcrypt';
import {UserModel} from './users';

const BCRYPT_SALT_WORK_FACTOR = 10;

export interface Comment {
    title: string;
    text: string;
    // Status : 1 created / 2 started / 3 finished / 4 deleted
    status: number;
    task: TaskModel,
    user: UserModel
}

export interface CommentModel extends Comment, BaseTime, Document {

}

const modelSchema = new Schema({
    title: { type: String, required: true},
    text: { type: String},
    taskID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    userID: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

modelSchema.pre('save', PreSaveAddingTimeStamp);


////// Create Model /////

export const CommentModel = model<CommentModel>('Comment', modelSchema);

////// Functions ////////

export function getComments(limit = 100) {
    return CommentModel.find().limit(limit);
}

export function getCommentById(id: string) {
    return CommentModel.findOne({ _id: id });
}

export function getCommentByTaskID(taskID: string) {
    return CommentModel.find({ taskID: taskID }).populate('userID');
}

export function addComment(input: Comment) {
    console.log(input);
    const sanitizedInput = {
        ...input,
        taskID: input.task,
        userID: input.user
    }
    const rec = CommentModel.create(sanitizedInput);

    return rec;
}

export function removeComment(id, connectedUser) {
    return CommentModel.findOneAndRemove({
        _id: id,
        userID: connectedUser
    });
}
