/* eslint-disable no-console */
import moment from "moment"
import userSeeder from "./user-seeder"
import closeContactSeeder from "./close-contact-seeder"
import "../src/connection"
import dropDB from "./drop-db"

function randomBetween(number) {
  return Math.floor(Math.random() * number)
}

async function seed() {
  // seed sample
  console.log("Drop DB")
  await dropDB()

  console.log("Seed users")
  const users = await userSeeder()

  console.log("Seed random closeContact from users")
  const closeContactSeederList = []
  for (let i = 0; i < 40; i += 1) {
    const contact = randomBetween(users.length)
    const contactee = randomBetween(users.length)
    const days = randomBetween(30)
    if (contact !== contactee)
      closeContactSeederList.push(
        closeContactSeeder(
          users[contact],
          users[contactee],
          moment().subtract(days, "days"),
        ),
      )
  }
  await Promise.all(closeContactSeederList)

  console.log("Seed success")
  process.exit(0)
}

seed()
