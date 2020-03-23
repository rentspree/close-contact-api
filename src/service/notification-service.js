/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import moment from "moment"
import { Types } from "mongoose"
import { CloseContact } from "../models/close-contact"
import { User, STATUS_ENUM } from "../models/user"
import { Notification } from "../models/notification"

const { ObjectId } = Types

const config = {
  [STATUS_ENUM.INFECTED]: (actorId, location, timestamps) => ({
    title: "INFECTION ALERT",
    description: `User ${actorId} marked to be infected , you meet each other at location ${location} on ${moment(
      timestamps,
    ).toString()}`, // TODO: format msg
    type: "infection_alert", // TODO: make an enum type
  }),
  [STATUS_ENUM.HEALTHY]: (actorId, location, timestamps) => ({
    title: "HEALTHY ALERT",
    description: `User ${actorId} marked healthy , you meet each other at location ${location} on ${moment(
      timestamps,
    ).toString()}`, // TODO: format msg
    type: "healthy_alert", // TODO: make an enum type
  }),
}

export const makeNotification = (actorId, status, notiTimeStamp) => {
  // make sure noti is made in FIFO thing. // so why timestamp is used here
  const sentUser = {}
  CloseContact.getContactForNotify(actorId)
    .cursor()
    .on("data", closeContact => {
      const { contact, contactee, timestamps, location } = closeContact
      const userToNotify = contact === actorId ? contactee : contact

      // send noti once per user
      if (!sentUser[`${userToNotify}`]) {
        sentUser[`${userToNotify}`] = true // mark for distinct
        // TODO: query user's device to make notification

        const noti = new Notification({
          // REVIEW select the first one or the last one ?
          notifier: ObjectId(userToNotify),
          actor: ObjectId(actorId),
          timestamps: moment(notiTimeStamp),
          ...config[status](actorId, location, timestamps),
          // read: ,
        })
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
