import fs from "fs"
import path from "path"
import gm from "gm"

const config = require("nfs-config-resolver")()
const Storage = require("@google-cloud/storage")

const credentials = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../private-key/gcloud-key.json")),
)
const storage = Storage({ credentials })
const configGCloud = config.gCloudStorage
const bucket = storage.bucket(configGCloud.bucket)

const resizeAndUpload = (filePath, file, option) =>
  new Promise((resolve, reject) => {
    gm(filePath)
      .resize(250, 250, "^")
      .gravity("Center")
      .crop(250, 250, 0, 0)
      .stream()
      .pipe(file.createWriteStream(option))
      .on("error", reject)
      .on("finish", () => {
        resolve()
      })
  })

const uploadOnly = (filePath, file, option) =>
  new Promise((resolve, reject) => {
    gm(filePath)
      .gravity("Center")
      .stream()
      .pipe(file.createWriteStream(option))
      .on("error", reject)
      .on("finish", () => {
        resolve()
      })
  })

export const upload = (filePath, option, resize = true) => {
  const file = bucket.file(option.destination)
  return resize
    ? resizeAndUpload(filePath, file, option).then(() => ({
        name: file.name,
        bucket: file.bucket.name,
      }))
    : uploadOnly(filePath, file, option).then(() => ({
        name: file.name,
        bucket: file.bucket.name,
      }))
}
