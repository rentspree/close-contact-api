/* eslint-disable no-unused-vars */
import { composeWithMongoose } from "graphql-compose-mongoose"
import { User } from "../models/user"

export const UserTC = composeWithMongoose(User, {})
