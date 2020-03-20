import express from "express"
import LoginHandler from "../middlewares/login"
import { authorizeIgnoreExpires } from "../middlewares/authorize-user"
import refreshTokenHandler from "../middlewares/refresh-token"

const router = express.Router()

router.use(LoginHandler)
router.use(authorizeIgnoreExpires(), refreshTokenHandler)

module.exports = router
