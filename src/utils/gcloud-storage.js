import fs from "fs"
import path from "path"

const config = require("nfs-config-resolver")()
const { Storage } = require("@google-cloud/storage")

const credentials = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../private-key/gcloud-key.json")),
)
const storage = new Storage({
  credentials,
})
const configGCloud = config.gCloudStorage
export const bucket = storage.bucket(configGCloud.bucket)
