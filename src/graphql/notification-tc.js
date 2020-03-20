import { composeWithMongoose } from "graphql-compose-mongoose"
import { Notification, nonUpdateFields } from "../models/notification"
import { makeInput } from "./helper"
import { User } from "../models/user"

export const NotificationTC = composeWithMongoose(Notification, {})
// only read can update
export const NotificationInputIC = makeInput(NotificationTC, nonUpdateFields)

NotificationTC.addFields({
  user: {
    type: "User",
    resolve: async source => {
      const { notifier } = source
      const userNotifier = await User.findOne({
        _id: notifier,
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
        actor: context.user._id, // @REVIEW : actor or notifier means who got to noti
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
    newResolver.getArgITC("filter").removeField(["_id", "actor"]) // @REVIEW : actor or notifier means who got to noti
    return newResolver
  })

export const updateProfileResolver = NotificationTC.getResolver("updateOne")
  .wrapResolve(next => async ({ args, context, ...rest }) => {
    const newArgs = {
      record: args,
      filter: {
        actor: context.user._id,
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
