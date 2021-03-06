import "source-map-support/register"
import rootSchema from "./graphql/schema"
import { authorize } from "./middlewares/authorize-user"

const createError = require("http-errors")
const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const graphqlHTTP = require("express-graphql")
const logger = require("morgan")
const indexRouter = require("./routes")
const usersRouter = require("./routes/users")

const app = express()

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "hbs")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/account", usersRouter)

app.use(
  "/graphql",
  authorize(),
  graphqlHTTP(req => ({
    schema: rootSchema,
    graphiql: true,
    context: {
      user: req.user,
    },
  })),
)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}
  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

module.exports = app
