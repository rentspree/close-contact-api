import moment from "moment"
import faker from "faker"
import { Notification } from "../src/models/notification"
import { randomBetween } from "./util-seeder"

function getFakeNotificationData(actorId, notifierId) {
  const timestampsDate = moment().subtract(randomBetween(60), "days")
  return {
    actor: actorId,
    notifier: notifierId,
    timestamps: timestampsDate,
    title: faker.lorem.sentence(),
    description: faker.lorem.sentences(),
    type: "infectedAlert",
  }
}

export default async function notificationSeeder(users) {
  const notificationData = []
  for (let i = 0; i <= parseInt(users.length * 0.5, 10); i += 1) {
    for (let j = 0; j <= randomBetween(20); j += 1) {
      const actorIndex = randomBetween(users.length)
      const actor = users[actorIndex]
      const notifier = users[i]
      if (actorIndex !== i)
        notificationData.push(getFakeNotificationData(actor._id, notifier._id))
    }
  }
  return Notification.create(notificationData)
}
