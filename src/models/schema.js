import { schemaComposer } from "graphql-compose"
import { UserTC } from "./user"
// Requests which read data put into Query

// schemaComposer.Query.addFields({
//   users: {
//     type: "[User]",
//     resolve: async () => {
//       const users = await User.find()
//       return users
//     },
//   },
// })

schemaComposer.Query.addFields({
  users: UserTC.getResolver("findMany"),
})

schemaComposer.Query.addFields({
  user: UserTC.getResolver("findOne"),
})

schemaComposer.Mutation.addFields({
  userCreate: UserTC.getResolver("createOne"),
  userUpdate: UserTC.getResolver("updateOne"),
})

// console.log(UserTC.schemaComposer.Query.setField)

export default UserTC.schemaComposer.buildSchema()
