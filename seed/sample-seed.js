/* eslint-disable no-console */
import { User } from "../src/models/User"

async function seedSample() {
  // seed sample
  console.log("seed sample complete")
  console.log(User)
  await User.create({ email: "mynameispipe@gmail.com" })
  process.exit(1)
}

seedSample()
