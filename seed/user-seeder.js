// import faker from "faker"
import { User } from "../src/models/user"

const users = [
  {
    facebookId: "fb_1",
    email: "tester+1@covid.com",
  },
  {
    facebookId: "fb_2",
    email: "tester+2@covid.com",
  },
  {
    facebookId: "fb_3",
    email: "tester+3@covid.com",
  },
  {
    facebookId: "fb_4",
    email: "tester+4@covid.com",
  },
  {
    facebookId: "fb_5",
    email: "tester+5@covid.com",
  },
]

export default async function userSeeder() {
  return User.create(users)
}
