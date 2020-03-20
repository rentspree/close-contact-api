import express from "express"
import oauth2orize from "oauth2orize"
import oauth2orizeFacebook from "@rentspree/oauth2orize-facebook"
import { User } from "../models/user"

/* eslint-disable consistent-return */
export const facebookLogin = async function(client, profile, scope, done) {
  try {
    const user = await User.findOrCreate(
      { facebookId: profile.id },
      { ...profile, isFacebookUser: true },
      User.parseFacebookProfileToUserProfile,
    )
    return user.issueUserAccessToken(done)
  } catch (e) {
    done({
      status: 401,
      code: e.name || "incorrect_credentials",
      message: e.message || "Incorrect facebook",
    })
  }
}
/* eslint-enable consistent-return */

/** @constant loginRouter */
const server = oauth2orize.createServer()

/**
 * This route api `POST /login` for login facebook
 * @param token the token facebook on front end
 * @name loginApi
 * @memberof loginRouter
 */
server.exchange(
  oauth2orizeFacebook(
    ["email", "first_name", "last_name", "picture.width(250)"],
    facebookLogin,
  ),
)

const router = express.Router()

router.post("/login", server.token())

export default router
