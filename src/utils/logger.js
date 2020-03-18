import createLogger from "@rentspree/logger"
import config from "../config"

const logger = createLogger({
  logLevel: config.logLevel,
})

export default logger
