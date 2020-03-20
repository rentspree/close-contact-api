import { transports, format, createLogger } from "winston"

import config from "../config"

export const stringifyLog = m =>
  typeof m === "string" ? m : JSON.stringify(m, null, 2)

const printAfter = info => {
  let { meta } = info
  if (!meta) {
    meta = info[Symbol("splat")] || []
  }
  if (!Array.isArray(meta)) {
    meta = [meta]
  }
  return `${meta.length ? ", " : ""}${meta.map(stringifyLog).join(", ")}`
}

const customFormat = format.printf(function(info) {
  const stringifiedMessage = stringifyLog(info.message)
  const timestamp =
    process.env.NODE_ENV === "production" ? "" : `${info.timestamp} `
  const metaLog = printAfter(info)
  return `${timestamp}[${info.level.toUpperCase()}]: ${stringifiedMessage}${metaLog}`
})

const consoleTransport = new transports.Console({
  format: format.combine(format.timestamp(), format.splat(), customFormat),
})

const convertToPlainObject = o => JSON.parse(JSON.stringify(o))
const isObjectLike = a => !!a && typeof a === "object"

const createRSPLogger = ({ logLevel = "info" }) => {
  // eslint-disable-next-line no-console
  console.log("initialize logger with level:", logLevel)
  const logger = createLogger({
    transports: [consoleTransport],
    level: logLevel,
  })

  const originalLogFn = fnName => logger[fnName].bind(logger)
  const createWrapLogFn = level => (...args) => {
    const convertedArgs = args.map(a =>
      isObjectLike(a) ? convertToPlainObject(a) : a
    )
    originalLogFn(level)(...convertedArgs)
  }
  const wrapLogger = {
    error: createWrapLogFn("error"),
    warn: createWrapLogFn("warn"),
    info: createWrapLogFn("info"),
    verbose: createWrapLogFn("verbose"),
    debug: createWrapLogFn("debug"),
    silly: createWrapLogFn("silly"),
    log(level, ...args) {
      return this[level] ? this[level](...args) : undefined
    },
  }
  return wrapLogger
}
const logger = createRSPLogger({
  logLevel: config.logLevel,
})

export default logger
