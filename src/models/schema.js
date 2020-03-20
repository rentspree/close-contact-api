import { schemaComposer } from "graphql-compose"
import { CloseContactTC } from "./close-contact-tc"
import { NotificationTC } from "./notification-tc"
import { UserTC } from "./user-tc"

schemaComposer.Query.addFields({
  users: UserTC.getResolver("findMany"),
  user: UserTC.getResolver("findOne"),
})

schemaComposer.Query.addFields({
  closeContacts: CloseContactTC.getResolver("findMany"),
  closeContact: CloseContactTC.getResolver("findOne"),
})

schemaComposer.Query.addFields({
  notifications: NotificationTC.getResolver("findMany"),
  notification: NotificationTC.getResolver("findOne"),
})

schemaComposer.Mutation.addFields({
  userCreate: UserTC.getResolver("createOne"),
  userUpdate: UserTC.getResolver("updateOne"),
})

export default UserTC.schemaComposer.buildSchema()
