import { schemaComposer } from "graphql-compose"
import { UserTC, User } from "./user"
// Requests which read data put into Query

schemaComposer.Query.addFields({
  users: {
    type: "[User]",
    resolve: async () => {
      return await User.find()
    },
  },
})

schemaComposer.Mutation.addFields({
  createUser: UserTC.getResolver("createOne"),
})

// console.log(UserTC.schemaComposer.Query.setField)

export default UserTC.schemaComposer.buildSchema()
