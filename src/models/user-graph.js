import { composeWithMongoose } from "graphql-compose-mongoose"
import { CloseContactTC } from "./close-contact-graph"
import { User } from "./user"

export const UserTC = composeWithMongoose(User, {})

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
