import { Schema } from "mongoose"
import mongoose from "../connection"

export const CONTACT_TYPE = {
  CONTACT: "contact",
  CONTACTEE: "contactee",
}

const PointSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
})

const CloseContactSchema = new Schema(
  {
    contact: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    contactee: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    timestamps: { type: Date, default: Date.now },
    location: {
      type: PointSchema,
    },
    note: { type: String },
    purpose: { type: String },
    protection: { type: String },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
    id: false,
  },
)

export const CloseContact = mongoose.model("CloseContact", CloseContactSchema)
