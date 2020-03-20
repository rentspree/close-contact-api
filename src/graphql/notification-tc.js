import { composeWithMongoose } from "graphql-compose-mongoose"
import { Notification } from "../models/notification"

export const NotificationTC = composeWithMongoose(Notification, {})
