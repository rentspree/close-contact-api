import { Schema } from "mongoose"
import moment from "moment"
import mongo from "../connection"
import * as ERROR from "../utils/errors"

/** @class Token */
const TokenSchema = new Schema({
  accessToken: { type: String },
  accessTokenExpiresAt: { type: Date },
  refreshToken: { type: String },
  refreshTokenExpiresAt: { type: Date },
  user: { type: Schema.Types.ObjectId, ref: "User" },
})

/**
 * update json to variable methods
 * @param {Object} jsonObject any object
 * @returns {Token} model Token
 * @memberof Token
 * @instance
 */
TokenSchema.methods.updateWithJSON = function(jsonObject) {
  Object.keys(jsonObject).forEach(key => {
    this[key] = jsonObject[key]
  })
  return this
}

/**
 * save access token and refresh token to mongo
 * @param {Object} objAccessToken the access token object
 * @param {String} objAccessToken.accessToken the accessToken of generate by jwt
 * @param {Date} objAccessToken.accessTokenExpiresAt the accessTokenExpiresAt of config access token expiresIn
 * @param {Object} objRefreshToken the refresh token object
 * @param {Date} objRefreshToken.refreshToken the refreshToken of random string
 * @param {Date} objRefreshToken.refreshTokenExpiresAt the refreshTokenExpiresAt of config refresh token expiresIn
 * @param {String} user that user id
 * @returns {Token} model Token
 * @memberof Token
 * @static
 */
TokenSchema.statics.saveAccessTokenAndRefreshToken = async function(
  objAccessToken,
  objRefreshToken,
  user,
) {
  // let token = await this.findOne({user})
  // if (!token) {
  const token = new this({ user })
  // }
  token.updateWithJSON(objAccessToken)
  token.updateWithJSON(objRefreshToken)
  return token.save()
}

/**
 * verify refresh token
 * check refresh token not match
 * check refresh token expired
 * @param {Date} refreshToken the refreshToken of send body front end
 * @param {String} userId the userId of send header authentication front end
 * @returns {Token} model Token
 * @memberof Token
 * @static
 */
TokenSchema.statics.verifyRefreshToken = async function(refreshToken, userId) {
  const token = await this.findOne({ refreshToken, user: userId })
  if (!token) {
    throw new ERROR.NotFoundError("Refresh token not match")
  }
  /* check expired refresh token */
  if (moment().diff(token.refreshTokenExpiresAt) > 0) {
    throw new ERROR.TokenExpired("Refresh token expired")
  }

  return token
}

export const Token = mongo.model("Token", TokenSchema)
