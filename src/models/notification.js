import { Schema } from "mongoose"
import connection from "../connection"

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

export const Notification = connection.model("CloseContact", NotificationSchema)
