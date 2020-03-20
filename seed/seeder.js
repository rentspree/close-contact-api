/* eslint-disable no-console */
import userSeeder from "./user-seeder"
import closeContactSeeder from "./close-contact-seeder"
import notificationSeeder from "./notification-seeder"
import "../src/connection"
import dropDB from "./drop-db"

async function seed() {
  // seed sample
  console.log("Drop DB")
  await dropDB()

  console.log("Seed users")
  const users = await userSeeder()

  console.log("Seed random closeContact from users")
  await closeContactSeeder(users)

  console.log("Seed notification")
  await notificationSeeder(users)

  console.log("Seed success")
  process.exit(0)
}

seed()
