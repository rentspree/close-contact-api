/* eslint-disable no-unused-vars */
import { composeWithMongoose } from "graphql-compose-mongoose"
import { CloseContactTC } from "./close-contact-tc"
import { User } from "../models/user"

export const UserTC = composeWithMongoose(User, {})

UserTC.addResolver({
  name: "me",
  type: "User",
  resolve: ({ source, context, info }) => {
    return context.user
  },
})

UserTC.addFields({
  contactTo: CloseContactTC.getResolver("contactTo"),
  contactFrom: CloseContactTC.getResolver("contactFrom"),
  contactAll: CloseContactTC.getResolver("contactAll"),
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
