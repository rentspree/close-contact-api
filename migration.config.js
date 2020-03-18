var config = require("./build/config")
var MongoClient = require("mongodb").MongoClient

var host = process.env.MONGO_DB || "localhost"
var db = "rsp-boilerplate"
var port = process.env.MONGO_DB_PORT || 27017

var obj = {
  mongoAppDb: {
    host: host,
    db: db,
    port: port,
  },
}

module.exports = obj
