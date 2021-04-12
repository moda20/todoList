import {
    GraphQLEnumType,
    GraphQLInterfaceType,
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt
} from 'graphql';

import {getTasks, getTaskById, addTask, removeTask, updateTaskStatus} from '../db/tasks';
import {UserSchema} from './user';
import {addComment, removeComment} from '../db/comments';

const taskType = new GraphQLObjectType({
    name: 'Task',
    description: 'A single Task',
    fields: () => ({
        title: {
            type: GraphQLString,
            description: 'The username',
        },
        text: {
            type: GraphQLString,
            description: 'The password',
        },
        comments: {
            type: new GraphQLList(commentType),
            description: 'Task Comments',
        },
        status: {
            type: GraphQLInt,
            description: 'Task status',
        },
        _id: {
            type: GraphQLString,
            description: 'automatically generated _id',
        },
        user: {
            type: UserSchema.types[0],
            description: 'associated user',
        }
    }),
});

const commentType = new GraphQLObjectType({
    name: 'Comment',
    description: 'A single Comment',
    fields: () => ({
        title: {
            type: GraphQLString,
            description: 'The title',
        },
        text: {
            type: GraphQLString,
            description: 'The test',
        },
        taskID: {
            type: GraphQLString,
            description: 'The taskID',
        },
        userID: {
            type: UserSchema.types[0],
            description: 'The userID',
        },
        _id: {
            type: GraphQLString,
            description: 'automatically generated _id',
        },
    }),
});

const query = {
    tasks: {
        type: new GraphQLList(taskType),
        args: {
            limit: {
                description: 'limit items in the results',
                type: GraphQLInt
            }
        },
        resolve: (root, { limit }) => getTasks(limit)
    },
    singleTask: {
        type: taskType,
        args: {
            _id: {
                description: 'find by _id',
                type: GraphQLString
            }
        },
        resolve: (root, { _id }) => getTaskById(_id)
    },
};

const mutation = {
    addTask: {
        type: taskType,
        args: {
            title: {
                type: new GraphQLNonNull(GraphQLString)
            },
            text: {
                type: new GraphQLNonNull(GraphQLString)
            },
            status: {
                type: new GraphQLNonNull(GraphQLInt)
            },
            user: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: (obj, input) => addTask(input)
    },
    deleteTask: {
        type: taskType,
        args: {
            _id: {
                type: new GraphQLNonNull(GraphQLString)
            },
            user: {
                type: new GraphQLNonNull(GraphQLString)
            },
        },
        resolve: (obj, input) => removeTask(input._id, input.user)
    },
    addComment: {
        type: commentType,
        args: {
            task: {
                type: new GraphQLNonNull(GraphQLString)
            },
            title: {
                type: new GraphQLNonNull(GraphQLString)
            },
            text: {
                type: new GraphQLNonNull(GraphQLString)
            },
            user: {
                type: new GraphQLNonNull(GraphQLString)
            }
        },
        resolve: (obj, input) => addComment(input)
    },
    deleteComment: {
        type: commentType,
        args: {
            _id: {
                type: new GraphQLNonNull(GraphQLString)
            },
            user: {
                type: new GraphQLNonNull(GraphQLString)
            },
        },
        resolve: (obj, input) => removeComment(input._id, input.user)
    },
    changeTaskStatus: {
        type: taskType,
        args: {
            _id: {
                type: new GraphQLNonNull(GraphQLString)
            },
            user: {
                type: new GraphQLNonNull(GraphQLString)
            },
            status: {
                type: new GraphQLNonNull(GraphQLInt)
            },
        },
        resolve: (obj, input) => updateTaskStatus(input._id, input.user, input.status)
    },
};

const subscription = {

};

export const taskSchema = {
    query,
    mutation,
    subscription,
    types: [taskType, commentType]
};
