import mongoose, { Schema } from "mongoose"
import { composeWithMongoose } from "graphql-compose-mongoose"

const NotificationSchema = new Schema(
  {
    notifier: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    timestamps: { type: Date, default: Date.now },
    title: String,
    description: String,
    type: String,
    read: { type: Date },
  },
  {
    timestamps: true,
  },
)

export const Notification = mongoose.model("Notification", NotificationSchema)

export const NotificationTC = composeWithMongoose(Notification, {})
