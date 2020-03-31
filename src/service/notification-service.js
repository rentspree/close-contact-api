/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import moment from "moment"
import { Types } from "mongoose"
import axios from "axios"
import { CloseContact } from "../models/close-contact"
import { User, STATUS_ENUM } from "../models/user"
import { Notification } from "../models/notification"
import { DeviceToken, TYPE_ENUM } from "../models/device-token"
import config from "../config"

const { ObjectId } = Types

const notificationConfig = {
  [STATUS_ENUM.INFECTED]: actorName => ({
    title: actorName,
    description: "อัปเดตสถานะเป็น มีเชื้อ", // TODO: format msg
    type: STATUS_ENUM.INFECTED, // TODO: make an enum type
  }),
  [STATUS_ENUM.HEALED]: actorName => ({
    title: actorName,
    description: "อัปเดตสถานะเป็น หายแล้้ว", // TODO: format msg
    type: STATUS_ENUM.HEALED, // TODO: make an enum type
  }),
}

export const makeNotification = async (actorId, status, notiTimeStamp) => {
  // make sure noti is made in FIFO thing. // so why timestamp is used here
  const { firstName, lastName } = await User.findById(actorId)
  const actorName = [firstName, lastName].join(" ")
  const sentUser = {}
  CloseContact.getContactForNotify(actorId)
    .cursor()
    .on("data", async closeContact => {
      const { contact, contactee, timestamps, location } = closeContact
      const userToNotify = contact === actorId ? contactee : contact

      // send noti once per user
      if (!sentUser[`${userToNotify}`]) {
        sentUser[`${userToNotify}`] = true // mark for distinct
        // TODO: query user's device to make notification
        const deviceTokens = DeviceToken.find({ user: userToNotify }) || {}
        const noti = new Notification({
          // REVIEW select the first one or the last one ?
          notifier: ObjectId(userToNotify),
          actor: ObjectId(actorId),
          timestamps: moment(notiTimeStamp),
          ...notificationConfig[status](actorName),
          // read: ,
        })
        Promise.all(
          deviceTokens.map(({ token, type }) => {
            if (type === TYPE_ENUM.FCM) {
              return axios.post(
                config.fcm.endpoint,
                {
                  to: token,
                  data: {
                    title: noti.title,
                    body: noti.description,
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
        noti.save((err, doc) => {
          if (err) {
            console.error("save noti error", err)
            return
          }
          console.info("save noti complete", doc._id)
        })
      }
    })
}
