/* eslint-disable no-console */
import userSeeder from "./user-seeder"
import closeContactSeeder from "./close-contact-seeder"
import dropDB from "./drop-db"

async function seed() {
  // seed sample
  console.log("Drop DB")
  await dropDB()

  console.log("Start seed")
  const users = await userSeeder()
  const closeContact = await closeContactSeeder(users[0], users[1])
  console.log(closeContact)
  console.log("Seed success")
  process.exit(0)
}

seed()
