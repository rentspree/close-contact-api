import { Schema } from "mongoose"
import mongo from "../connection"

/** @class DeviceToken */
const DeviceTokenSchema = new Schema({
  deviceTokens: { type: Array, default: [] },
  user: { type: Schema.Types.ObjectId, ref: "User" },
})

DeviceTokenSchema.statics.pushDeviceToken = async function(
  userId,
  deviceToken,
) {
  let token = await this.findOne({ user: userId })
  if (!token) {
    token = new this({ user: userId, deviceTokens: [deviceToken] })
  } else {
    token.deviceToken = [...token.deviceTokens, deviceToken]
  }
  return token.save()
}

export const DeviceToken = mongo.model("DeviceToken", DeviceTokenSchema)