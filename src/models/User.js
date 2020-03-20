import mongoose from "mongoose"
import connection from "../connection"

const UserSchema = new mongoose.Schema(
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

export const User = connection.model("User", UserSchema)
