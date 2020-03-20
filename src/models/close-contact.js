import mongoose, { Schema } from "mongoose"
import moment from "moment"

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
    contactId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    contacteeId: {
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

/**
 * This method will find the user who contacted with the patient in 14 days
 * and send push notification to the potential infected user
 */
CloseContactSchema.statics.notifyCloseContact = async function(patientId) {
  const incubationPeriod = moment().subtract(14, "days")
  const potentialInfection = await this.find({
    timestamps: {
      $gte: incubationPeriod,
    },
    $or: [
      {
        contacteeId: patientId,
      },
      {
        contactId: patientId,
      },
    ],
  })

  // TODO: send notification to potentialInfection contacts
  // TODO: remove the return when working on send notification
  return potentialInfection
}

export const CloseContact = mongoose.model("CloseContact", CloseContactSchema)
