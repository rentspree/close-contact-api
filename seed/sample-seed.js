/* eslint-disable no-console */
import { User } from "../src/models/user"

async function seedSample() {
  // seed sample
  try {
    await User.insertMany([
      {
        name: "john",
        age: 20,
      },
    ])
  } catch (e) {
    console.log("Error removing plans =========> ", e)
    process.exit(1)
  }
  console.log("seed sample complete")
}

seedSample()
