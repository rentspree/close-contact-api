import { Schema } from "mongoose"
import connection from "../connection"

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

export const User = connection.model("User", UserSchema)
