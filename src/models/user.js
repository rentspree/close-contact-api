import mongoose, { Schema } from "mongoose"

import { composeWithMongoose } from "graphql-compose-mongoose"
import { schemaComposer } from "graphql-compose"

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
const UserTC = composeWithMongoose(User, {})

schemaComposer.Query.addFields({
  userById: UserTC.getResolver("findById"),
  userByIds: UserTC.getResolver("findByIds"),
  userOne: UserTC.getResolver("findOne"),
  userMany: UserTC.getResolver("findMany"),
  userCount: UserTC.getResolver("count"),
  userConnection: UserTC.getResolver("connection"),
  userPagination: UserTC.getResolver("pagination"),
})

schemaComposer.Mutation.addFields({
  userCreateOne: UserTC.getResolver("createOne"),
  userCreateMany: UserTC.getResolver("createMany"),
  userUpdateById: UserTC.getResolver("updateById"),
  userUpdateOne: UserTC.getResolver("updateOne"),
  userUpdateMany: UserTC.getResolver("updateMany"),
  userRemoveById: UserTC.getResolver("removeById"),
  userRemoveOne: UserTC.getResolver("removeOne"),
  userRemoveMany: UserTC.getResolver("removeMany"),
})

const graphqlSchema = schemaComposer.buildSchema()
export default graphqlSchema
