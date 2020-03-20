/* eslint-disable no-unused-vars */
import { composeWithMongoose } from "graphql-compose-mongoose"
import { CloseContactTC } from "./close-contact-tc"
import { User } from "../models/user"

export const UserTC = composeWithMongoose(User, {})

UserTC.addResolver({
  name: "findUser",
  type: "User",
  resolve: async ({ source, context, info }) => {
    // console.log(context)
    // const contacteeIds = await CloseContact.find({
    //   contact: ObjectId(source._id),
    // }).distinct("contactee")
    // const contactee = await User.find({
    //   _id: { $in: contacteeIds },
    // })
    // return contactee
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
