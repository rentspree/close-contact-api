/* eslint-disable no-unused-vars */
import { composeWithMongoose } from "graphql-compose-mongoose"
import { CloseContactTC } from "./close-contact-tc"
import { User } from "../models/user"

export const UserTC = composeWithMongoose(User, {})

UserTC.addFields({
  contacts: CloseContactTC.getResolver("contactAll"),
  contactsTo: CloseContactTC.getResolver("contactTo"),
  contactsFrom: CloseContactTC.getResolver("contactFrom"),
})

UserTC.addResolver({
  name: "edit",
  kind: "mutation",
  type: "User",
  resolve: async ({ source, args, context }) => {
    const { user, ...data } = args
    const userInDb = await User.find({ _id: user._id })
  },
})
// ex
/**
 * TweetTC.addResolver({
  kind: 'mutation',
  name: 'createTweetWithRels',
  type: TweetTC.getResolver('createOne').getType(),
  args: TweetTC.getResolver('createOne').getArgs(),
  resolve: (rp) => {
     ...custom logic
     return $shapeOfOutputType;
  },
});
 */
