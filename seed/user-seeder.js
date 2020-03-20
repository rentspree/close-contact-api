import { User } from "../src/models/user"

const users = [
  {
    facebookId: "fb_1",
    email: "tester+1@covid.com",
    name: "Tester+1",
  },
  {
    facebookId: "fb_2",
    email: "tester+2@covid.com",
    name: "Tester+2",
  },
  {
    facebookId: "fb_3",
    email: "tester+3@covid.com",
    name: "Tester+3",
  },
  {
    facebookId: "fb_4",
    email: "tester+4@covid.com",
    name: "Tester+4",
  },
  {
    facebookId: "fb_5",
    email: "tester+5@covid.com",
    name: "Tester+5",
  },
]

export default async function userSeeder() {
  return User.create(users)
}
