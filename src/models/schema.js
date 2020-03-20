import { schemaComposer } from "graphql-compose"
import { UserTC, User } from "./user"
// Requests which read data put into Query

schemaComposer.Query.addFields({
  users: {
    type: "[User]",
    resolve: async () => {
      const users = await User.find()
      return users
    },
  },
})

schemaComposer.Query.addFields({
  user: UserTC.getResolver("findMany"),
})

schemaComposer.Mutation.addFields({
  userCreate: UserTC.getResolver("createOne"),
  userUpdate: UserTC.getResolver("updateOne"),
})

// console.log(UserTC.schemaComposer.Query.setField)

export default UserTC.schemaComposer.buildSchema()
