import { Schema } from "mongoose"
import mongo from "../connection"
import * as ERROR from "../utils/errors"

/** @class DeviceToken */
const DeviceTokenSchema = new Schema({
  deviceTokens: { type: Array, default: [] },
  user: { type: Schema.Types.ObjectId, ref: "User" },
})

DeviceTokenSchema.statics.pushDeviceToken = async function(
  userId,
  deviceToken,
) {
  const token = await this.findOne({ user: userId })
  if (!token) {
    throw new ERROR.NotFoundError("Device token not found")
  }
  token.deviceToken = [...token.deviceToken, deviceToken]
  return token.save()
}

export const DeviceToken = mongo.model("DeviceToken", DeviceTokenSchema)
