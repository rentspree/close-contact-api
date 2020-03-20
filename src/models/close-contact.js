import { Schema } from "mongoose"
import { composeWithMongoose } from "graphql-compose-mongoose"
import mongoose from "../connection"

const PointSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
  },
  coordinates: {
    type: [Number],
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

export const CloseContact = mongoose.model("CloseContact", CloseContactSchema)

export const CloseContactTC = composeWithMongoose(CloseContact, {
  name: "CloseContact",
})

CloseContactTC.addResolver({
  name: "findByContactee",
  args: { contacteeId: "String!" },
  type: "[User]",
  resolve: async ({ args: { contacteeId } }) => {
    const closeContacts = await CloseContact.findMany({ contacteeId })
      .populate("contactId")
      .exec()
    return closeContacts.map(a => a.contactId)
  },
})
