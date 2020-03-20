import { Schema } from "mongoose"
import mongoose from "../connection"
import { composeWithMongoose } from "graphql-compose-mongoose"

const UserSchema = new Schema(
  {
    facebookId: String,
    email: String,
    status: String,
    hasAcceptedTerm: Date,
  },
  {
    timestamps: true,
  },
)

export const User = mongoose.model("User", UserSchema)

export const UserTC = composeWithMongoose(User, {})
