import express from "express"
import LoginHandler from "../middlewares"

const router = express.Router()

router.use(LoginHandler)

module.exports = router
