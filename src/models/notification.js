import mongoose, { Schema } from "mongoose"

const NotificationSchema = new Schema(
  {
    userId: {
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

export const Notification = mongoose.model("CloseContact", NotificationSchema)
