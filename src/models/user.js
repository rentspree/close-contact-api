import fs from "fs"
import path from "path"
import { Schema } from "mongoose"
import merge from "lodash/merge"
import pick from "lodash/pick"
import randomstring from "randomstring"
import jwt from "jsonwebtoken"
import config from "../config"
import { Token } from "./token"
import mongoose from "../connection"
import { setMillisecondToDate } from "../utils/convert-date"
import { uploadImage, downloadProfilePicture } from "../utils/upload-images"

const UserSchema = new Schema(
  {
    facebookId: String,
    email: String,
    name: String,
    status: String,
    hasAcceptedTerm: { type: Date, default: Date.now },
    profilePicture: String,
    firstName: String,
    lastName: String,
  },
  {
    timestamps: true,
  },
)

export const cert = fs.readFileSync(
  path.resolve(__dirname, "../../certs", "private.key"),
)

/**
 * A User object
 * @typedef {Object} User
 * @property {MongooseID} _id - The id of the user document in the mongo collection
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
 * @param {Function} parseProfile the profile parse that will use to parse profile data object to user data object
 * @returns {User} model of this saved instance
 *
 * @example
 *
 * User.findOrCreate({ email: "test@test.com" }, { id: "12345678", first_name: "Jon", last_name: "Snow" })
 *
 */
UserSchema.statics.findOrCreate = async function(
  findCondition,
  profile,
  parseProfile,
) {
  const user = await this.findOne(findCondition)
  if (!user) {
    const newUser = new this({ ...parseProfile(profile) })
    if (profile.isFacebookUser) {
      try {
        if (!profile.picture.data.is_silhouette) {
          const filePath = await downloadProfilePicture(
            profile.picture.data.url,
            newUser._id,
            "image/jpeg",
          )
          newUser.profilePicture = await uploadImage(
            newUser._id,
            "profile-image",
            true,
            "image/jpeg",
            filePath,
          )
          await newUser.save()
        }
      } catch (e) {
        console.error("Error facebook picture=", e) // eslint-disable-line
      }
    }
    return newUser.save()
  }
  return user
}

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
  profilePicture: profile.image,
  firstName: profile.first_name,
  lastName: profile.last_name,
})

UserSchema.methods.issueUserAccessToken = async function(done) {
  const token = await this.saveToken()
  await this.save()
  return done(null, token.accessToken, token.refreshToken)
}

/**
 * generate access token by JWT
 * @param {Object} option additional option for generate access token
 * @returns {Object} that Object, accessToken and accessTokenExpiresAt
 */
UserSchema.methods.generateToken = function(option = {}) {
  const opt = {
    algorithm: "RS256",
    expiresIn: config.accessToken.expiresIn,
  }
  merge(option, opt)
  const accessTokenExpiresAt = setMillisecondToDate(opt.expiresIn)
  const accessToken = jwt.sign(
    {
      _id: this._id,
    },
    cert,
    option,
  )
  return {
    accessToken,
    accessTokenExpiresAt,
  }
}

/**
 * generate refresh token by random string
 * @returns {Object} that Object, refreshToken and refreshTokenExpiresAt
 * @memberof User
 * @instance
 */
UserSchema.methods.generateRefreshToken = function() {
  return {
    refreshToken: randomstring.generate(),
    refreshTokenExpiresAt: setMillisecondToDate(config.refreshToken.expiresIn),
  }
}

/**
 * save token
 * generate access token
 * generate refresh token
 * save to mongo
 * @returns {Token} model token
 * @memberof User
 * @instance
 */
UserSchema.methods.saveToken = function() {
  const accessToken = this.generateToken()
  const refreshToken = this.generateRefreshToken()
  return Token.saveAccessTokenAndRefreshToken(
    accessToken,
    refreshToken,
    this._id,
  )
}

UserSchema.method.editProfile = async updateObj => {
  const allowUpdated = pick(updateObj, [
    "name",
    "profilePicture",
    "firstName",
    "lastName",
  ])
  Object.entries(allowUpdated).reduce((p, [k, v]) => {
    p[k] = v
    return p
  }, this)
  await this.save()
}

export const User = mongoose.model("User", UserSchema)
