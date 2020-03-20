import express from "express"
import oauth2orize from "oauth2orize"
import { User } from "../models/user"
import { Token } from "../models/token"

/** @constant TokenRouter */
const server = oauth2orize.createServer()

/**
 * This route api `POST /token` for get token
 * @param refresh_token the refresh_token google on front end
 * @name tokenApi
 * @memberof TokenRouter
 */
server.exchange(
  oauth2orize.exchange.refreshToken(
    async (client, refreshToken, scope, done) => {
      try {
        const token = await Token.verifyRefreshToken(refreshToken, client._id)
        await Token.remove({ _id: token._id })
        const user = await User.findById(client._id)
        const newToken = await user.saveToken()
        user.lastRefreshTokenRequested = Date.now()
        await user.save()
        done(null, newToken.accessToken, newToken.refreshToken)
      } catch (e) {
        done({
          status: 401,
          code: e.name || "incorrect_refresh_token",
          message: e.message || "Incorrect refresh token",
        })
      }
    },
  ),
)

const router = express.Router()

router.post("/token", server.token())

export default router
