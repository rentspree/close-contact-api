import mongoose, { Schema } from "mongoose"
import { composeWithMongoose } from "graphql-compose-mongoose"

const NotificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    timestamps: { type: Date, default: Date.now },
    title: String,
    subject: String,
    note: String,
  },
  {
    timestamps: true,
  },
)

export const Notification = mongoose.model("Notification", NotificationSchema)

export const NotificationTC = composeWithMongoose(Notification, {})
