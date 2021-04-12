import { Schema, model, Document } from 'mongoose';
import { BaseTime, PreSaveAddingTimeStamp } from './base';
import * as bcrypt from 'bcrypt';
import {CommentModel, getCommentByTaskID} from './comments';
import {UserModel} from './users';
const BCRYPT_SALT_WORK_FACTOR = 10;

export interface Task {
    xid: string,
    title: string;
    text: string;
    // Status : 1 created / 2 started / 3 finished / 4 deleted
    status: number;
    user: UserModel
}

export interface TaskModel extends Task, BaseTime, Document {

}

const modelSchema = new Schema({
    title: { type: String, required: true},
    text: { type: String},
    status: { type: Number, default: 1},
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

modelSchema.pre('save', PreSaveAddingTimeStamp);


////// Create Model /////

export const taskModel = model<TaskModel>('Task', modelSchema);

////// Functions ////////

export async function getTasks(limit = 100) {
    const tasks = taskModel.find().populate('user')
        .limit(limit).exec().then(async (taskList) => {
            await Promise.all(taskList.map(async (task) => {
                task['comments'] = await getCommentByTaskID(task._id);
                console.log(task['comments']);
            }));
            return taskList;
        })
    return tasks;
}

export function getTaskById(id: string) {
    return taskModel.findOne({ _id: id }).populate('user').exec();
}


export function addTask(input: Task) {
    const rec = taskModel.create(input);

    return rec;
}

export function removeTask(id: string, user: string) {
    return taskModel.findOneAndRemove({_id: id, user: user});
}
export function updateTaskStatus(id, userId, status) {
    return taskModel.findOneAndUpdate({_id: id}, {status: status});
}
