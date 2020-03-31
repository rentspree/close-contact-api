import express from "express"
import axios from "axios"
import { authorize } from "../middlewares/authorize-user"
import { DeviceToken, TYPE_ENUM } from "../models/device-token"
import { User } from "../models/user"
import config from "../config"

const router = express.Router()

router.use(authorize())

router.post("/push-device", async (req, res, next) => {
  try {
    const { _id } = req.user || {}
    const { deviceToken, type } = req.body || {}
    const updatedDeviceTokens = await DeviceToken.pushDeviceToken(
      _id,
      deviceToken,
      type,
    )
    res.send(updatedDeviceTokens)
  } catch (err) {
    next(err)
  }
})

router.post("push", async (req, res, next) => {
  try {
    const { actorId, userToNotify } = req.body
    const { firstName, lastName } = await User.findById(actorId)
    const actorName = [firstName, lastName].join(" ")
    const deviceTokens = DeviceToken.find({ user: userToNotify })
    const notifications = await Promise.all(
      deviceTokens.map(({ token, type }) => {
        if (type === TYPE_ENUM.FCM) {
          return axios.post(
            config.fcm.endpoint,
            {
              to: token,
              data: {
                title: actorName,
                body: "This is a notification from /notifications/push",
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
                Host: "fcm.googleapis.com",
                Authorization: `key=${config.fcm.serverKey}`,
              },
            },
          )
        }
        if (type === TYPE_ENUM.APNS) {
          // TODO: integrate with APNS
          return null
        }
        return null
      }),
    )
    res.send({ actorName, deviceTokens, notifications })
  } catch (err) {
    next(err)
  }
})

module.exports = router
