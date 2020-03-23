import { composeWithMongoose } from "graphql-compose-mongoose"
import moment from "moment"
import { User, nonUpdateFields, STATUS_ENUM } from "../models/user"
import { makeInput } from "./helper"
import { makeNotification } from "../service/notification-service"

export const UserTC = composeWithMongoose(User, {})
const UserInputTC = makeInput(UserTC, nonUpdateFields)
const statusEnumTC = UserTC.getITC().getFieldTC("status")

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

// export const updateStatusResolver = UserTC.getResolver("updateOne")
//   .wrapResolve(next => async ({ args, context, ...rest }) => {
//     const newArgs = {
//       record: args,
//       filter: {
//         _id: context.user._id,
//       },
//     }
//     const res = await next({
//       args: newArgs,
//       context,
//       ...rest,
//     })
//     return res.record
//   })
//   .wrap(newResolver => newResolver, {
//     args: {
//       status: statusEnumTC.getTypeNonNull(),
//     },
//     type: UserTC,
//   })

UserTC.addResolver({
  kind: "mutation",
  name: "setInfectionStatus",
  args: {
    status: statusEnumTC.getTypeNonNull(),
  },
  type: UserTC,
  resolve: async ({ source, context, args }) => {
    const eventTimestamp = moment()
    const { status } = args
    const user = await User.findOne({ _id: context.user._id })
    if (!user) {
      throw new Error("the user is not found in system ", context.user._id)
    }
    // status not change
    if (status === user.status) return user
    makeNotification(context.user._id, status, eventTimestamp)
    user.status = status
    await user.save()
    return user
  },
})
