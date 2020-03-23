import { composeWithMongoose } from "graphql-compose-mongoose"
import { Notification, nonUpdateFields } from "../models/notification"
import { makeInput } from "./helper"
import { User } from "../models/user"

export const NotificationTC = composeWithMongoose(Notification, {})
// only read can update
export const NotificationInputIC = makeInput(NotificationTC, nonUpdateFields)

NotificationTC.addFields({
  // current notification sender to the current user
  user: {
    type: "User",
    resolve: async source => {
      const { actor } = source
      const userNotifier = await User.findOne({
        _id: actor,
      })
      return userNotifier
    },
    projection: { actor: true, notifier: true },
  },
})

export const findNotificationResolver = NotificationTC.getResolver("findMany")
  .wrapResolve(next => async ({ args, context, ...rest }) => {
    const { filter = {}, ...restArgs } = args
    const newArgs = {
      ...restArgs,
      filter: {
        ...filter,
        notifier: context.user._id,
      },
    }
    const res = await next({
      args: newArgs,
      context,
      ...rest,
    })
    return res
  })
  .wrap(newResolver => {
    newResolver.getArgITC("filter").removeField(["_id", "notifier"])
    return newResolver
  })

export const updateNotificationResolver = NotificationTC.getResolver(
  "updateOne",
)
  .wrapResolve(next => async ({ args, context, ...rest }) => {
    const newArgs = {
      record: args,
      filter: {
        notifier: context.user._id,
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
    args: NotificationInputIC.getFields(),
    type: NotificationTC,
  })
