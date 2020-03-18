var mongodb = require("mongodb")

exports.up = function(db, next) {
  var Person = db.collection("people")
  Person.updateMany({}, { $set: { occupation: "unemployed" } }, null, function(
    err,
    result,
  ) {
    console.log("=================================")
    console.log(`Documents modified: ${result.result.n}`)
    console.log("Add occupation completed")
    console.log("=================================")
    next()
  })
}

exports.down = function(db, next) {
  var Person = db.collection("people")
  Person.updateMany({}, { $unset: { occupation: "" } }, null, function(
    err,
    result,
  ) {
    console.log("=================================")
    console.log(`Documents modified: ${result.result.n}`)
    console.log("Remove occupation completed")
    console.log("=================================")
    next()
  })
}
