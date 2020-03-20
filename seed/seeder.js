/* eslint-disable no-console */
import userSeeder from "./user-seeder"
import dropDB from "./drop-db"

async function seed() {
  // seed sample
  console.log("Drop DB")
  await dropDB()

  console.log("Start seed")
  await userSeeder()

  console.log("Seed success")
  process.exit(0)
}

seed()
