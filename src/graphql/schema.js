/* eslint-disable no-unused-vars */
import { schemaComposer } from "graphql-compose"
import { NotificationTC } from "./notification-tc"
import { UserTC } from "./user-tc"
import { CloseContactTC } from "./close-contact-tc"

schemaComposer.Query.addFields({
  me: {
    type: UserTC.getTypeName(),
    resolve: (_source, _args, context) => context.user,
  },
  users: UserTC.getResolver("findMany"),
  user: UserTC.getResolver("findOne"),
  closeContacts: CloseContactTC.getResolver("findMany"),
  closeContact: CloseContactTC.getResolver("findOne"),
  notifications: NotificationTC.getResolver("findMany"),
  notification: NotificationTC.getResolver("findOne"),
})

schemaComposer.Mutation.addFields({
  userCreate: UserTC.getResolver("createOne"),
  userUpdate: UserTC.getResolver("updateOne"),
  closeContactCreate: CloseContactTC.getResolver("createOne"),
  closeContactUpdate: CloseContactTC.getResolver("updateOne"),
  notificationCreate: NotificationTC.getResolver("createOne"),
  notificationUpdate: NotificationTC.getResolver("updateOne"),
})

export default UserTC.schemaComposer.buildSchema()
