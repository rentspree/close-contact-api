import mongoose, { Schema } from "mongoose"

const NotificationSchema = new Schema(
  {
    notifier: {
      // receiver
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    actor: {
      // sender
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
export const nonUpdateFields = [
  "actor",
  "notifier",
  "timestamps",
  "type",
  "title",
  "description",
]
