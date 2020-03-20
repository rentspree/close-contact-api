import mongoose from "mongoose"
// import sleep from "system-sleep"
import config from "./config"
import logger from "./utils/logger"

const { host, database, port, options } = config.mongodb
// sleep(4000)

mongoose
  .connect(`mongodb://${host}:${port}/${database}`, options)
  .then(() => logger.info("MongoDB connection success ..."))
  .catch(err => logger.error("MongoDB connection error ...", err))

mongoose.Promise = require("bluebird")

const db = mongoose.connection

db.on("error", e => {
  logger.error("MongoDB connection error ...", e)
  process.exit(1)
})

db.once("open", () => {
  logger.info("MongoDB Connected ...")
})

export default db
