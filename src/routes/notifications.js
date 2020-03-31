import express from "express"
import { Expo } from "expo-server-sdk"
import { authorize } from "../middlewares/authorize-user"
import { DeviceToken } from "../models/device-token"

const expo = new Expo()

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

// ref: https://github.com/expo/expo-server-sdk-node
// TODO: integrated with makeNotification service or call POST api from front-end
router.post(async req => {
  const { pushTokens = [], messageBody, messageData = {} } = req.body
  const messages = pushTokens.reduce((result, pushToken) => {
    if (Expo.isExpoPushToken(pushToken)) {
      result.push({
        to: pushToken,
        sound: "default",
        body: messageBody,
        data: messageData,
      })
    }
    return result
  }, [])
  const messagesChunks = expo.chunkPushNotifications(messages)
  const tickets = []
  try {
    await Promise.all(
      messagesChunks.map(async messagesChunk => {
        const ticketsChunk = await expo.sendPushNotificationsAsync(
          messagesChunk,
        )
        tickets.push(...ticketsChunk)
      }),
    )
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
  }

  const receiptIds = tickets.reduce((result, ticket) => {
    if (ticket.id) {
      result.push(ticket.id)
    }
    return result
  }, [])
  const receiptIdsChunks = expo.chunkPushNotificationReceiptIds(receiptIds)
  try {
    await Promise.all(
      receiptIdsChunks.map(async receiptIdsChunk => {
        const receipts = await expo.getPushNotificationReceiptsAsync(
          receiptIdsChunk,
        )

        receipts.map(({ status, message, details }) => {
          if (status === "error") {
            // eslint-disable-next-line no-console
            console.error(
              `There was an error sending a notification: ${message}`,
            )
            if (details && details.error) {
              // eslint-disable-next-line no-console
              console.error(`The error code is ${details.error}`)
            }
          }
          return null
        })
      }),
    )
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
  }
})

module.exports = router
