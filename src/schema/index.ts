import {GraphQLSchema, GraphQLObjectType} from 'graphql';

import { UserSchema } from './user';
import { taskSchema } from './task';

export const graphqlSchema = new GraphQLSchema({
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: () => Object.assign(
            UserSchema.mutation,
            taskSchema.mutation,
        )
    }),
    query: new GraphQLObjectType({
        name: 'Query',
        fields: () => Object.assign(
            UserSchema.query,
            taskSchema.query,
        )
    }),
    types: [
        ...UserSchema.types,
        ...taskSchema.types
    ]
});
