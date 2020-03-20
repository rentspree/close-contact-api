import { User } from "../src/models/user"

const users = [
  {
    email: "tester+1@covid.com",
    name: "Tester+1",
  },
  {
    email: "tester+2@covid.com",
    name: "Tester+2",
  },
  {
    email: "tester+3@covid.com",
    name: "Tester+3",
  },
]

export default async function userSeeder() {
  await User.create(users)
}
