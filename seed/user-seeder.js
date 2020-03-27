import faker from "faker"
import { User, STATUS_ENUM } from "../src/models/user"

const userCount = parseInt(process.argv.slice(2)[0], 10) || 5

function getFakeUserData() {
  return {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    facebookId: `fb_${faker.random.uuid()}`,
    profilePicture: faker.image.avatar(),
    status: faker.random.arrayElement(Object.values(STATUS_ENUM)),
  }
}

export default async function userSeeder() {
  const users = []
  for (let i = 0; i < userCount; i += 1) {
    users.push(getFakeUserData())
  }
  return User.create(users)
}
