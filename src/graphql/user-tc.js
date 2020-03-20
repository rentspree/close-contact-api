import { composeWithMongoose } from "graphql-compose-mongoose"
import { User, nonUpdateFields } from "../models/user"
import { makeInput } from "./helper"

export const UserTC = composeWithMongoose(User, {})

const UserInputTC = makeInput(UserTC, nonUpdateFields)

export const updateProfileResolver = UserTC.getResolver("updateOne")
  .wrapResolve(next => async ({ args, context, ...rest }) => {
    const newArgs = {
      record: args,
      filter: {
        _id: context.user._id,
      },
    }
    const res = await next({
      args: newArgs,
      context,
      ...rest,
    })
    return res.record
  })
  .wrap(newResolver => newResolver, {
    args: UserInputTC.getFields(),
    type: UserTC,
  })
