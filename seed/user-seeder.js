import faker from "faker"
import { User } from "../src/models/user"

const userCount = parseInt(process.argv.slice(2)[0], 10) || 5

function getFakeUserData() {
  return {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    facebookId: `fb_${faker.random.uuid()}`,
  }
}

export default async function userSeeder() {
  const users = []
  for (let i = 0; i < userCount; i += 1) {
    users.push(getFakeUserData())
  }
  return User.create(users)
}
