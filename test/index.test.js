// import fs from "fs"
// import path from "path"
// import Promise from "bluebird"
// import mongodb from "../src/connection"

// // Import all factory module
// before(done => {
//   const files = fs.readdirSync(path.join(__dirname, "./factory/"))
//   Promise.all([
//     Promise.map(files, file =>
//       import(path.join(__dirname, "./factory/", file)),
//     ),
//     mongodb.dropDatabase(),
//   ])
//     .then(() => {
//       done()
//     })
//     .catch(done)
// })

// after(() => mongodb.close())
