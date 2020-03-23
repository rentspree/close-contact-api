import passport from "passport"
import { Strategy as BearerStrategy } from "passport-http-bearer"
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
import fs from "fs"
import path from "path"
import { User } from "../models/user"

export const authorizeIgnoreExpires = () => [
  passport.authenticate("jwtIgnoreExpires", { session: false }),
]

passport.use(
  "accessToken",
  new BearerStrategy((accessToken, done) => done(null, true)),
)

passport.use(
  "jwtIgnoreExpires",
  new JwtStrategy(
    {
      ignoreExpiration: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
      secretOrKey: fs.readFileSync(
        path.resolve(__dirname, "../../certs", "public.pem"),
      ),
    },
    async (jwtPayload, done) => {
      try {
        if (jwtPayload) {
          done(null, jwtPayload)
        } else {
          done(null, false)
        }
      } catch (e) {
        done(e, false)
      }
    },
  ),
)

passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
      secretOrKey: fs.readFileSync(
        path.resolve(__dirname, "../../certs", "public.pem"),
      ),
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload._id)
        if (user) {
          done(null, user)
        } else {
          done(null, false)
        }
      } catch (e) {
        done(e, false)
      }
    },
  ),
)
const devUserMock = async (req, res, next) => {
  req.user = await User.findOne()
  next()
}
export const authorize = () => [
  process.env.NODE_ENV === "production"
    ? passport.authenticate("jwt", { session: false })
    : devUserMock,
]

export function stripToken(req) {
  return req.headers.authorization
    ? req.headers.authorization.replace(/^Bearer\s/, "")
    : null
}
