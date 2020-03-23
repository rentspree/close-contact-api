import { schemaComposer } from "graphql-compose"
import {
  findNotificationResolver,
  updateNotificationResolver,
} from "./notification-tc"
import { UserTC, updateProfileResolver, updateStatusResolver } from "./user-tc"
import {
  CloseContactTC,
  findContactResolver,
  makeContactResolver,
  updateContactResolver,
} from "./close-contact-tc"

schemaComposer.Query.addFields({
  profile: {
    type: UserTC,
    resolve: (_source, _args, context) => context.user,
  },
  contacts: findContactResolver,
  contactPersons: CloseContactTC.getResolver("contactPersons"),
  notifications: findNotificationResolver,
})

schemaComposer.Mutation.addFields({
  profile: updateProfileResolver,
  contact: updateContactResolver,
  makeContact: makeContactResolver,
  notification: updateNotificationResolver, // for set read of any notification
  setInfectionStatus: updateStatusResolver, // send/unsend noti to all user related
})
/**
 *   notifications [Notification] {
   //filter
  }
  
 */
export default UserTC.schemaComposer.buildSchema()

// data loader for cache
// https://github.com/graphql-compose/graphql-compose-dataloader
// pagination
// https://github.com/graphql-compose/graphql-compose-connection
