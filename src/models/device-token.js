import { Schema } from "mongoose"
import mongo from "../connection"

export const TYPE_ENUM = {
  APNS: "APNS",
  FCM: "FCM",
}

/** @class DeviceToken */
const DeviceTokenSchema = new Schema({
  type: { type: String, enum: Object.values(TYPE_ENUM) },
  token: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "User" },
})

DeviceTokenSchema.statics.pushDeviceToken = async function(
  userId,
  token,
  type,
) {
  let deviceToken = await this.findOne({ token })
  if (!deviceToken) {
    deviceToken = new this({ user: userId, token, type })
    await deviceToken.save()
  }
  return deviceToken
}

export const DeviceToken = mongo.model("DeviceToken", DeviceTokenSchema)
