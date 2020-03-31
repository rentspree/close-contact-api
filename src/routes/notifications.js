import express from "express"
import { authorize } from "../middlewares/authorize-user"
import { DeviceToken } from "../models/device-token"

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

module.exports = router
