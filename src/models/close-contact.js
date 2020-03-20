import { Schema } from "mongoose"
import connection from "../connection"

const pointSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
  },
  coordinates: {
    type: [Number],
  },
})

const closeContactSchema = new Schema(
  {
    contactId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    contacteeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    timestamps: { type: Date },
    location: {
      type: pointSchema,
    },
    note: { type: String },
    purpose: { type: String },
    protection: { type: String },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
    id: false,
  },
)

export const CloseContact = connection.model("CloseContact", closeContactSchema)
