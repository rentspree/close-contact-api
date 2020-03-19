import { makeExecutableSchema } from "graphql-tools"
import user from "../models/user"
// import resolvers from "./resolvers"

// const typeDefs = Object.values(user).join("\n")

const schema = makeExecutableSchema({
  typeDefs: user.schema,
  // resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
})

export default schema
