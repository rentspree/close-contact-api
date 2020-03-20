import moment from "moment"
import { CloseContact } from "../src/models/close-contact"
import { randomBetween } from "./util-seeder"

function getRnd(min, max) {
  return (Math.random() * (max - min) + min).toFixed(6)
}

function getRandomCooridinatesInBangkok() {
  const lat = {
    min: 13.60907,
    max: 14.020275,
  }
  const ln = {
    min: 100.305023,
    max: 100.999588,
  }
  return [getRnd(lat.min, lat.max), getRnd(ln.min, ln.max)]
}

function getFakeCloseContactData(contact, contactee, coordinates) {
  const days = randomBetween(30)
  return {
    contact,
    contactee,
    timestamps: moment().subtract(days, "days"),
    location: {
      coordinates,
    },
  }
}

export default async function closeContactSeeder(users) {
  const closeContactList = []
  for (let i = 0; i < users.length * 8; i += 1) {
    const contact = randomBetween(users.length)
    const contactee = randomBetween(users.length)
    if (contact !== contactee)
      closeContactList.push(
        getFakeCloseContactData(
          users[contact]._id,
          users[contactee]._id,
          getRandomCooridinatesInBangkok(),
        ),
      )
  }
  return CloseContact.create(closeContactList)
}
