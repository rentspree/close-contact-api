import express from "express"
import { authorize } from "../middlewares/authorize-user"

const router = express.Router()

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" })
})

router.get("/test-auth", authorize(), function(req, res, next) {
  res.send("Only auth user see this")
})

module.exports = router
