import { Schema } from "mongoose"
import { composeWithMongoose } from "graphql-compose-mongoose"
import mongoose from "../connection"
import { CloseContactTC } from "./close-contact"

const UserSchema = new Schema(
  {
    facebookId: String,
    email: String,
    name: String,
    status: String,
    hasAcceptedTerm: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
)

export const User = mongoose.model("User", UserSchema)

export const UserTC = composeWithMongoose(User, {})
// 1) contact to ?
// 2) who contact to me?
// 3) count together

UserTC.addFields({
  closeContacts: CloseContactTC.getResolver("findMany"),
})

// const schemaComposer = new SchemaComposer()

// schemaComposer.Query.addFields({
//   userById: UserTC.getResolver("findById"),
//   userByIds: UserTC.getResolver("findByIds"),
//   userOne: UserTC.getResolver("findOne"),
//   userMany: UserTC.getResolver("findMany"),
//   userCount: UserTC.getResolver("count"),
//   userConnection: UserTC.getResolver("connection"),
//   userPagination: UserTC.getResolver("pagination"),
// })

// schemaComposer.Mutation.addFields({
//   userCreateOne: UserTC.getResolver("createOne"),
//   userCreateMany: UserTC.getResolver("createMany"),
//   userUpdateById: UserTC.getResolver("updateById"),
//   userUpdateOne: UserTC.getResolver("updateOne"),
//   userUpdateMany: UserTC.getResolver("updateMany"),
//   userRemoveById: UserTC.getResolver("removeById"),
//   userRemoveOne: UserTC.getResolver("removeOne"),
//   userRemoveMany: UserTC.getResolver("removeMany"),
// })

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
