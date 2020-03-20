import { Schema } from "mongoose"
import { composeWithMongoose } from "graphql-compose-mongoose"
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
