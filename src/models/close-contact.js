/* eslint-disable no-unused-vars */
import { Schema, Types } from "mongoose"
import { composeWithMongoose } from "graphql-compose-mongoose"
import mongoose from "../connection"

const { ObjectId } = Types

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

export const CloseContactTC = composeWithMongoose(CloseContact)

CloseContactTC.addFields({
  contacteeUser: {
    type: "User", // array of Posts
    resolve: async (source, args, req) => {
      const cc = await CloseContact.findOne({
        _id: ObjectId(source._id),
      })
        .populate("contactee")
        .exec()
      return cc.contactee
    },
  },
  contactUser: {
    type: "User", // array of Posts
    resolve: async (source, args, req) => {
      const cc = await CloseContact.findOne({
        _id: ObjectId(source._id),
      })
        .populate("contact")
        .exec()
      return cc.contact
    },
  },
})

CloseContactTC.addResolver({
  name: "contactTo",
  type: "[User]",
  resolve: async ({ source, args, context, info }) => {
    const cc = await CloseContact.find({
      contact: ObjectId(source._id),
    }).populate("contactee")
    return cc.map(c => c.contactee)
  },
})

CloseContactTC.addResolver({
  name: "contactFrom",
  type: "[User]",
  resolve: async ({ source, args, context, info }) => {
    const cc = await CloseContact.find({
      contactee: ObjectId(source._id),
    }).populate("contact")
    return cc.map(c => c.contact)
  },
})
