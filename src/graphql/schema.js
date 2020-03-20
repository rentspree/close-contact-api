import { schemaComposer } from "graphql-compose"
import { CloseContactTC } from "./close-contact-tc"
import { NotificationTC } from "./notification-tc"
import { UserTC } from "./user-tc"

// async function authMiddleware(resolve, source, args, context, info) {
//   if (context.user) {
//     return resolve(source, args, context, info)
//   }
//   throw new Error("You must be authorized")
// }

schemaComposer.Query.addFields({
  // me: UserTC.getResolver("me", [authMiddleware]),
  me: {
    type: UserTC.getTypeName(),
    resolve: (source, args, context, info) => {
      return context.user
    },
  },
})

schemaComposer.Query.addFields({
  users: UserTC.getResolver("findMany"),
  user: UserTC.getResolver("findOne"),
})

// schemaComposer.Query.addFields({
//   closeContacts: CloseContactTC.getResolver("findMany"),
//   closeContact: CloseContactTC.getResolver("findOne"),
// })

schemaComposer.Query.addFields({
  notifications: NotificationTC.getResolver("findMany"),
  notification: NotificationTC.getResolver("findOne"),
})

// schemaComposer.Mutation.addFields({
//   userCreate: UserTC.getResolver("createOne"),
//   userUpdate: UserTC.getResolver("updateOne"),
// })

// MUTATIONS
schemaComposer.Mutation.addFields({
  editProfile: UserTC.getResolver("edit", [
    (resolve, source, args, context, info) => {
      const { user } = context
      return resolve(
        source,
        {
          ...args,
          user,
        },
        context,
        info,
      )
    },
  ]),
})

export default UserTC.schemaComposer.buildSchema()
