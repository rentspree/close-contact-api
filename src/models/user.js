import { Schema } from "mongoose"
import { composeWithMongoose } from "graphql-compose-mongoose"
import { schemaComposer } from "graphql-compose"
import mongoose from "../connection"

const UserSchema = new Schema(
  {
    facebookId: String,
    email: String,
    status: String,
    hasAcceptedTerm: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
)

export const User = mongoose.model("User", UserSchema)

export const UserTC = composeWithMongoose(User, {})
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

export const UserSchemaComposer = schemaComposer
