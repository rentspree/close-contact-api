import mongoose from "mongoose"
import connection from "../connection"

const UserSchema = new mongoose.Schema(
  {
    facebookId: String,
    email: String,
    status: String,
    hasAcceptedTerm: Date,
  },
  {
    timestamps: true,
  },
)

/**
 * A User object
 * @typedef {Object} User
 * @property {MongooseID} id - The id of the user document in the mongo collection
 * @property {String} facebookId - The facebook id of the user
 * @property {String} email - The user email
 * @property {String} status - The state of the user
 * @property {Date} hasAcceptedTerm - The year
 */

/**
 * A Profile object
 * @typedef {Object} Profile
 * @property {String} id - The user id from facebook
 * @property {String} email - user's last name
 * @property {String} first_name - user's last name
 * @property {String} last_name - user's last name
 * @property {String} picture - user's profile picture
 */

/**
 * This method is used to find the existing user on the system
 * If there is no user that match the condition in the system it will create and return a brand new user instead
 *
 * @param {Object} findCondition the condition use to find the user from database
 * @param {Profile} profile the profile object
 * @returns {User} model of this saved instance
 *
 * @example
 *
 * User.findOrCreate({ email: "test@test.com" }, { id: "12345678", first_name: "Jon", last_name: "Snow" })
 *
 */
// UserSchema.statics.findOrCreate = async function(
//   findCondition,
//   profile,
//   parseProfile,
// ) {
//   const user = await this.findOne(findCondition)
//   if (!user) {
//   }
//   return user
// }

/**
 * This method is used to convert facebook profile object to user profile object
 *
 * @param {Profile} profile the profile object
 * @returns parsed object
 *
 */
UserSchema.statics.parseFacebookProfileToUserProfile = (profile = {}) => ({
  facebookId: profile.id,
  email: profile.email,
  image: profile.image,
})

/**
 * This method is used to find the existing user on the system
 * If there is no user that match the condition in the system it will create and return a brand new user instead
 *
 * @param {Object} findCondition the condition use to find the user from database
 * @param {Profile} profile the profile object
 * @returns {User} model of this saved instance
 *
 * @example
 *
 * User.findOrCreate({ email: "test@test.com" }, { id: "12345678", first_name: "Jon", last_name: "Snow" })
 *
 */
UserSchema.statics.facebook = async function(profile = {}) {
  const user = await this.findOne({ facebookId: profile.id })
  if (!user) {
    const userByEmail = await this.findOne({ email: profile.email })
    if (userByEmail) return userByEmail
    const newUser = await this.model("User").save(
      this.parseFacebookProfileToUserProfile(profile),
    )
    return newUser
  }
  return user
}

export const User = connection.model("User", UserSchema)
