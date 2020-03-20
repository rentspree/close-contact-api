import { Schema } from "mongoose"
import mongoose from "../connection"

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
