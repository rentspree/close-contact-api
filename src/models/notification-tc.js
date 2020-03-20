import { composeWithMongoose } from "graphql-compose-mongoose"
import { Notification } from "./notification"

export const NotificationTC = composeWithMongoose(Notification, {})
