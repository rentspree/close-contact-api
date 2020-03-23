import { Schema } from "mongoose"
import moment from "moment"
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

/**
 * This method will find the user who contacted with the patient in the given period ( default to 14 days)
 */
CloseContactSchema.statics.getPersonContactInPeriod = function(
  patientId,
  since,
  until,
) {
  const potentialInfection = this.find({
    ...((since || until) && {
      timestamps: {
        ...(since && { $gte: since }),
        ...(until && { $lt: until }),
      },
    }),
    $or: [
      {
        contactee: patientId,
      },
      {
        contact: patientId,
      },
    ],
  })

  return potentialInfection
}

// OVERLOADED METHOD
CloseContactSchema.statics.getPersonsInCloseContact = function(id) {
  return this.getPersonContactInPeriod(id)
}

CloseContactSchema.statics.getContactForNotify = function(id) {
  return this.getPersonContactInPeriod(
    id,
    moment().subtract(14, "days"),
    moment(),
  )
}

export const CloseContact = mongoose.model("CloseContact", CloseContactSchema)
